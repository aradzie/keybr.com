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

test("trainSecondKey can be toggled on and off mid-run without losing progress", async ({
  page,
}) => {
  // Sized for the keystroke budgets' worst case, not just the typical
  // case, so an unlucky seed fails its own assertion, not a timeout.
  test.setTimeout(6 * 60_000);

  const seed = Number(process.env.FUZZ_SEED) || Date.now();
  console.log(
    `trainSecondKey churn seed: ${seed} (rerun with FUZZ_SEED=${seed} to replay)`,
  );
  const random = mulberry32(seed);
  const SETUP_KEYSTROKE_BUDGET = 3000;
  const POST_CHURN_KEYSTROKE_BUDGET = 1500;

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
          `Key ${cp} regressed before churning trainSecondKey after ${keystrokes} keystrokes (seed ${seed})`,
        );
      }
    }
    keys = next;
  }
  const includedBeforeOn = alphabet.filter((cp) => keys.get(cp)!.included);
  expect(
    includedBeforeOn.length,
    `expected at least 7 keys included before enabling trainSecondKey within ${SETUP_KEYSTROKE_BUDGET} keystrokes (seed ${seed})`,
  ).toBeGreaterThanOrEqual(7);

  // addInitScript, not evaluate: the base settings init script above
  // reruns on every navigation including reload, clobbering a plain write.
  await page.addInitScript(
    (settings) => {
      localStorage.setItem("settings", JSON.stringify(settings));
    },
    { ...baseSettings, "lesson.guided.trainSecondKey": true },
  );
  await page.reload();
  await expect(page.locator("[data-code-point]").first()).toBeVisible();
  await page.locator("textarea").first().focus();

  expect(
    (await readAppliedSettings(page))["lesson.guided.trainSecondKey"],
    `expected the trainSecondKey change to have actually taken effect (seed ${seed})`,
  ).toBe(true);

  keys = await snapshotKeys(page);
  for (const cp of includedBeforeOn) {
    expect(
      keys.get(cp)!.included,
      `expected previously-included key ${cp} to still be included right after enabling trainSecondKey (seed ${seed})`,
    ).toBe(true);
  }

  roundSignature = await roundTextSignature(page);
  delay = randomDelay(random);
  keystrokes = 0;

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
    for (const cp of includedBeforeOn) {
      expect(
        next.get(cp)!.included,
        `expected key ${cp} to never regress after enabling trainSecondKey, after ${keystrokes} keystrokes (seed ${seed})`,
      ).toBe(true);
    }
    const newlyIncluded = alphabet.filter(
      (cp) => !keys.get(cp)!.included && next.get(cp)!.included,
    );
    expect(
      newlyIncluded.length,
      `expected at most one newly-included key per round after enabling trainSecondKey, got [${newlyIncluded}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toBeLessThanOrEqual(1);
    const secondFocusedInSet = alphabet.filter(
      (cp) => next.get(cp)!.secondFocused,
    );
    expect(
      secondFocusedInSet.length,
      `expected at most one second-focused key, got [${secondFocusedInSet}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toBeLessThanOrEqual(1);
    const secondFocused = secondFocusedInSet[0] ?? null;
    if (secondFocused != null && !next.get(secondFocused)!.included) {
      // Only the true next-in-line letter is ever previewed while locked;
      // exactly what the user should see highlighted as "up next".
      const nextKeyExpected = alphabet.find((cp) => !next.get(cp)!.included);
      expect(
        secondFocused,
        `expected the locked second-focused key to be the true next-in-line letter ${nextKeyExpected}, got ${secondFocused} after ${keystrokes} keystrokes (seed ${seed})`,
      ).toEqual(nextKeyExpected);
    }
    const forced = alphabet.filter((cp) => next.get(cp)!.forced);
    expect(
      forced,
      `expected no forced keys under default alphabetSize: 0, got [${forced}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toEqual([]);
    keys = next;
  }

  const includedBeforeOff = alphabet.filter((cp) => keys.get(cp)!.included);

  // Toggle back off: a settings reload must not lose anything gained
  // while trainSecondKey was on, including any second-focus-driven unlock.
  await page.addInitScript((settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, baseSettings);
  await page.reload();
  await expect(page.locator("[data-code-point]").first()).toBeVisible();
  await page.locator("textarea").first().focus();

  expect(
    (await readAppliedSettings(page))["lesson.guided.trainSecondKey"],
    `expected the trainSecondKey change to have actually taken effect (seed ${seed})`,
  ).toBeFalsy();

  keys = await snapshotKeys(page);
  for (const cp of includedBeforeOff) {
    expect(
      keys.get(cp)!.included,
      `expected key ${cp} to still be included right after disabling trainSecondKey (seed ${seed})`,
    ).toBe(true);
  }
  const secondFocusedAfterOff = alphabet.filter(
    (cp) => keys.get(cp)!.secondFocused,
  );
  expect(
    secondFocusedAfterOff,
    `expected no second-focused key once trainSecondKey is disabled, got [${secondFocusedAfterOff}] (seed ${seed})`,
  ).toEqual([]);
});
