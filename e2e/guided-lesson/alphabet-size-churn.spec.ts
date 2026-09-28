import { expect, test } from "@playwright/test";
import {
  announcedCodePoints,
  CURSOR_SELECTOR,
  KEY_SET_SELECTOR,
  mulberry32,
  randomDelay,
  readAppliedSettings,
  roundTextSignature,
  sendChar,
  snapshotKeys,
} from "./helpers.ts";

test("alphabetSize > 0 force-includes several keys at once", async ({
  page,
}) => {
  // Sized for the keystroke budget's worst case, not just the typical
  // case, so an unlucky seed fails its own assertion, not a timeout.
  test.setTimeout(5 * 60_000);

  const seed = Number(process.env.FUZZ_SEED) || Date.now();
  console.log(
    `alphabetSize churn seed: ${seed} (rerun with FUZZ_SEED=${seed} to replay)`,
  );
  const random = mulberry32(seed);
  const SETUP_KEYSTROKE_BUDGET = 3000;
  const ALPHABET_SIZE = 0.3;
  const minSize = 6;

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
  const maxSize =
    minSize + Math.round((alphabet.length - minSize) * ALPHABET_SIZE);

  let keys = await snapshotKeys(page);
  let roundSignature = await roundTextSignature(page);
  let delay = randomDelay(random);
  let keystrokes = 0;

  // Get a few keys included first, to check continuity across the churn.
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
          `Key ${cp} regressed before churning alphabetSize after ${keystrokes} keystrokes (seed ${seed})`,
        );
      }
    }
    keys = next;
  }
  const includedBefore = alphabet.filter((cp) => keys.get(cp)!.included);
  expect(
    includedBefore.length,
    `expected at least 7 keys included before churning alphabetSize within ${SETUP_KEYSTROKE_BUDGET} keystrokes (seed ${seed})`,
  ).toBeGreaterThanOrEqual(7);

  // addInitScript, not evaluate: the base settings init script above
  // reruns on every navigation including reload, clobbering a plain write.
  await page.addInitScript(
    (settings) => {
      localStorage.setItem("settings", JSON.stringify(settings));
    },
    { ...baseSettings, "lesson.guided.alphabetSize": ALPHABET_SIZE },
  );
  await page.reload();
  await expect(page.locator("[data-code-point]").first()).toBeVisible();
  await page.locator("textarea").first().focus();

  expect(
    (await readAppliedSettings(page))["lesson.guided.alphabetSize"],
    `expected the alphabetSize change to have actually taken effect (seed ${seed})`,
  ).toBe(ALPHABET_SIZE);

  // GuidedLesson.update() rebuilds LessonKeys from scratch every call, so
  // this applies the instant the page (re)mounts - no typing needed.
  const afterReload = await snapshotKeys(page);
  const includedAfter = alphabet.filter((cp) => afterReload.get(cp)!.included);
  const forcedAfter = alphabet.filter((cp) => afterReload.get(cp)!.forced);
  const announcedAfter = await announcedCodePoints(page);
  // Progress replays persisted results through append() with a no-op
  // listener (progress.ts's seed()/seedAsync()), so nothing included this
  // way, forced or not, ever gets a "New letter unlocked" toast.
  for (const cp of forcedAfter) {
    expect(
      announcedAfter,
      `expected no "New letter unlocked" toast for forced key ${cp} (seed ${seed})`,
    ).not.toContain(cp);
  }

  for (const cp of includedBefore) {
    expect(
      afterReload.get(cp)!.included,
      `expected previously-included key ${cp} to still be included after raising alphabetSize (seed ${seed})`,
    ).toBe(true);
  }
  expect(
    includedAfter.length,
    `expected at least ${Math.min(maxSize, alphabet.length)} keys included once alphabetSize forces up to maxSize=${maxSize} (seed ${seed})`,
  ).toBeGreaterThanOrEqual(Math.min(maxSize, alphabet.length));
  expect(
    forcedAfter.length,
    `expected some forced keys once alphabetSize is ${ALPHABET_SIZE} (seed ${seed})`,
  ).toBeGreaterThan(0);
  expect(
    forcedAfter.length,
    `expected at most maxSize-minSize=${maxSize - minSize} forced keys (seed ${seed})`,
  ).toBeLessThanOrEqual(maxSize - minSize);
  for (const cp of forcedAfter) {
    expect(
      afterReload.get(cp)!.uncalibrated,
      `expected freshly-forced key ${cp} to be uncalibrated (seed ${seed})`,
    ).toBe(true);
  }
});
