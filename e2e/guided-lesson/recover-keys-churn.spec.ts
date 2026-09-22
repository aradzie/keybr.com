import { expect, test } from "@playwright/test";
import {
  CURSOR_SELECTOR,
  KEY_SET_SELECTOR,
  mulberry32,
  randomDelay,
  readAppliedSettings,
  roundTextSignature,
  sendChar,
  snapshotKeys,
} from "./helpers.ts";

test("recoverKeys allows a key to legitimately regress", async ({ page }) => {
  // Sized for the keystroke budgets' worst case, not just the typical
  // case, so an unlucky seed fails its own assertion, not a timeout.
  test.setTimeout(6 * 60_000);

  const seed = Number(process.env.FUZZ_SEED) || Date.now();
  console.log(
    `recoverKeys churn seed: ${seed} (rerun with FUZZ_SEED=${seed} to replay)`,
  );
  const random = mulberry32(seed);
  const SETUP_KEYSTROKE_BUDGET = 3000;
  const POST_CHURN_KEYSTROKE_BUDGET = 800;

  const baseSettings = {
    "lesson.type": "guided",
    "keyboard.layout": "en-us",
  };
  await page.addInitScript((settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, baseSettings);

  await page.goto("/");
  await expect(page.locator("[data-code-point]").first()).toBeVisible();
  await page.locator("textarea").first().focus();

  const alphabet = await page
    .locator(KEY_SET_SELECTOR)
    .evaluateAll((els) => els.map((el) => el.getAttribute("data-code-point")!));
  // GuidedLesson.update() always includes these unconditionally, regardless
  // of confidence or recoverKeys, so they can never legitimately regress.
  const initialBatch = new Set(alphabet.slice(0, 6));

  let keys = await snapshotKeys(page);
  let roundSignature = await roundTextSignature(page);
  let delay = randomDelay(random);
  let keystrokes = 0;

  while (
    keystrokes < SETUP_KEYSTROKE_BUDGET &&
    alphabet.filter((cp) => keys.get(cp)!.included).length < 7
  ) {
    const displayedChar = await page
      .locator(CURSOR_SELECTOR)
      .first()
      .textContent();
    await sendChar(page, displayedChar ?? "");
    keystrokes++;
    await page.waitForTimeout(delay);

    const signature = await roundTextSignature(page);
    if (signature === roundSignature) {
      continue;
    }
    roundSignature = signature;
    delay = randomDelay(random);

    const next = await snapshotKeys(page);
    for (const cp of alphabet) {
      if (keys.get(cp)!.included && !next.get(cp)!.included) {
        throw new Error(
          `Key ${cp} regressed before churning recoverKeys after ${keystrokes} keystrokes (seed ${seed})`,
        );
      }
    }
    keys = next;
  }
  expect(
    alphabet.filter((cp) => keys.get(cp)!.included).length,
    `expected at least 7 keys included before churning recoverKeys within ${SETUP_KEYSTROKE_BUDGET} keystrokes (seed ${seed})`,
  ).toBeGreaterThanOrEqual(7);

  // addInitScript, not evaluate: the base settings init script above
  // reruns on every navigation including reload, clobbering a plain write.
  await page.addInitScript(
    (settings) => {
      localStorage.setItem("settings", JSON.stringify(settings));
    },
    { ...baseSettings, "lesson.guided.recoverKeys": true },
  );
  await page.reload();
  await expect(page.locator("[data-code-point]").first()).toBeVisible();
  await page.locator("textarea").first().focus();

  expect(
    (await readAppliedSettings(page))["lesson.guided.recoverKeys"],
    `expected the recoverKeys change to have actually taken effect (seed ${seed})`,
  ).toBe(true);

  keys = await snapshotKeys(page);
  for (const cp of initialBatch) {
    expect(
      keys.get(cp)!.included,
      `expected guaranteed initial key ${cp} to still be included right after enabling recoverKeys (seed ${seed})`,
    ).toBe(true);
  }

  roundSignature = await roundTextSignature(page);
  delay = randomDelay(random);
  keystrokes = 0;
  // recoverKeys uses live confidence, not bestConfidence, so a key beyond
  // the initial batch can legitimately lose inclusion - not forced here.
  let sawRegressionBeyondInitialBatch = false;

  while (keystrokes < POST_CHURN_KEYSTROKE_BUDGET) {
    const displayedChar = await page
      .locator(CURSOR_SELECTOR)
      .first()
      .textContent();
    await sendChar(page, displayedChar ?? "");
    keystrokes++;
    await page.waitForTimeout(delay);

    const signature = await roundTextSignature(page);
    if (signature === roundSignature) {
      continue;
    }
    roundSignature = signature;
    delay = randomDelay(random);

    const next = await snapshotKeys(page);
    for (const cp of initialBatch) {
      expect(
        next.get(cp)!.included,
        `expected guaranteed initial key ${cp} to never regress, even with recoverKeys, after ${keystrokes} keystrokes (seed ${seed})`,
      ).toBe(true);
    }
    for (const cp of alphabet) {
      if (
        !initialBatch.has(cp) &&
        keys.get(cp)!.included &&
        !next.get(cp)!.included
      ) {
        sawRegressionBeyondInitialBatch = true;
      }
    }
    // The "force" branch only triggers when alphabetSize > 0.
    const forced = alphabet.filter((cp) => next.get(cp)!.forced);
    expect(
      forced,
      `expected no forced keys under default alphabetSize: 0, got [${forced}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toEqual([]);
    keys = next;
  }

  console.log(
    `recoverKeys regression observed beyond the initial batch: ${sawRegressionBeyondInitialBatch} (seed ${seed})`,
  );
});
