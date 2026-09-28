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

test("progress survives mid-run settings changes and a target-speed ramp", async ({
  page,
}) => {
  // Sized for the keystroke budget's worst case, not just the typical
  // case, so an unlucky seed fails its own assertion, not a timeout.
  test.setTimeout(6 * 60_000);

  const seed = Number(process.env.FUZZ_SEED) || Date.now();
  console.log(
    `settings-churn seed: ${seed} (rerun with FUZZ_SEED=${seed} to replay)`,
  );
  const random = mulberry32(seed);
  const CHURN_KEYSTROKE_BUDGET = 4000;

  const baseSettings = {
    "lesson.type": "guided",
    "keyboard.layout": "en-us",
    "lesson.targetSpeed": 75,
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

  // naturalWords only affects word generation, not GuidedLesson.update()'s
  // inclusion logic, so no regression is expected across this reload.
  async function churnNaturalWords() {
    const included = alphabet.filter((cp) => keys.get(cp)!.included);
    const settings = {
      ...baseSettings,
      "lesson.guided.naturalWords": false,
    };
    // addInitScript, not evaluate: the base settings init script above
    // reruns on every navigation including reload, clobbering a plain write.
    await page.addInitScript((s) => {
      localStorage.setItem("settings", JSON.stringify(s));
    }, settings);
    await page.reload();
    await expect(page.locator("[data-code-point]").first()).toBeVisible();
    await page.locator("textarea").first().focus();

    expect(
      (await readAppliedSettings(page))["lesson.guided.naturalWords"],
      `expected the naturalWords change to have actually taken effect (seed ${seed})`,
    ).toBe(false);

    keys = await snapshotKeys(page);
    for (const cp of included) {
      expect(
        keys.get(cp)!.included,
        `expected key ${cp} to still be included after toggling naturalWords (seed ${seed})`,
      ).toBe(true);
    }
  }

  // Confidence is computed against the target, so raising it can
  // legitimately re-lock a key beyond the guaranteed initial 6 - not
  // asserted here; what must still hold is asserted below.
  async function churnTargetSpeed(newTargetSpeed: number) {
    const included = alphabet.filter((cp) => keys.get(cp)!.included);
    const settings = {
      ...baseSettings,
      "lesson.guided.naturalWords": false,
      "lesson.targetSpeed": newTargetSpeed,
    };
    await page.addInitScript((s) => {
      localStorage.setItem("settings", JSON.stringify(s));
    }, settings);
    await page.reload();
    await expect(page.locator("[data-code-point]").first()).toBeVisible();
    await page.locator("textarea").first().focus();

    expect(
      (await readAppliedSettings(page))["lesson.targetSpeed"],
      `expected the targetSpeed change to have actually taken effect (seed ${seed})`,
    ).toBe(newTargetSpeed);

    keys = await snapshotKeys(page);
    for (const cp of alphabet) {
      if (!included.includes(cp) && !initialBatch.has(cp)) {
        expect(
          keys.get(cp)!.included,
          `expected key ${cp} not to newly qualify for inclusion just from raising the target speed to ${newTargetSpeed} (seed ${seed})`,
        ).toBe(false);
      }
    }
  }

  let naturalWordsChurned = false;
  let targetSpeedChurned = false;

  while (
    keystrokes < CHURN_KEYSTROKE_BUDGET &&
    !(naturalWordsChurned && targetSpeedChurned)
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
    for (const codePoint of alphabet) {
      if (keys.get(codePoint)!.included && !next.get(codePoint)!.included) {
        throw new Error(
          `Key ${codePoint} regressed from included to excluded after ${keystrokes} keystrokes (seed ${seed})`,
        );
      }
    }
    keys = next;

    const includedCount = alphabet.filter(
      (cp) => keys.get(cp)!.included,
    ).length;
    if (!naturalWordsChurned && includedCount >= 7) {
      await churnNaturalWords();
      naturalWordsChurned = true;
      roundSignature = await roundTextSignature(page);
      delay = randomDelay(random);
    } else if (
      naturalWordsChurned &&
      !targetSpeedChurned &&
      includedCount >= 8
    ) {
      await churnTargetSpeed(300);
      targetSpeedChurned = true;
      roundSignature = await roundTextSignature(page);
      delay = randomDelay(random);
    }
  }

  expect(
    naturalWordsChurned && targetSpeedChurned,
    `expected both settings changes to be exercised within ${CHURN_KEYSTROKE_BUDGET} keystrokes (seed ${seed}); naturalWordsChurned=${naturalWordsChurned}, targetSpeedChurned=${targetSpeedChurned}`,
  ).toBe(true);
});
