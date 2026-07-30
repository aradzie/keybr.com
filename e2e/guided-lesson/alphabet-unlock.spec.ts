import { expect, type Page, test } from "@playwright/test";
import {
  announcedCodePoints,
  CURSOR_SELECTOR,
  KEY_SET_SELECTOR,
  type KeySnapshot,
  MAX_KEYSTROKES,
  mulberry32,
  randomDelay,
  roundTextSignature,
  sendChar,
  snapshotKeys,
  SPACE_GLYPHS,
} from "./helpers.ts";

const CURRENT_KEY_SELECTOR = '[id*="currentKey"] [data-code-point]';
const CURRENT_KEY_DETAILS_SELECTOR = '[id*="currentKey"] [class*="keyDetails"]';
const FUMBLE_PROBABILITY = 0.15;

test("typing through the full American English alphabet never regresses an unlocked key", async ({
  page,
}) => {
  // Scoped to this test only, since a fuzz test's worst-case runtime
  // varies a lot by seed - the other tests should keep failing fast.
  test.setTimeout(15 * 60_000);

  const seed = Number(process.env.FUZZ_SEED) || Date.now();
  console.log(`fuzz seed: ${seed} (rerun with FUZZ_SEED=${seed} to replay)`);
  const random = mulberry32(seed);

  await page.addInitScript(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        "lesson.type": "guided",
        "keyboard.layout": "en-us",
      }),
    );
  });

  await page.goto("/");
  await expect(page.locator("[data-code-point]").first()).toBeVisible();
  await page.locator("textarea").first().focus();

  const alphabet = await page
    .locator(KEY_SET_SELECTOR)
    .evaluateAll((els) => els.map((el) => el.getAttribute("data-code-point")!));
  expect(alphabet.length).toBeGreaterThan(0);

  let keys = await snapshotKeys(page);
  let roundSignature = await roundTextSignature(page);
  let delay = randomDelay(random);
  let keystrokes = 0;
  // True once past the initial minSize batch, when only one key is ever
  // sub-threshold at a time and "target only advances" becomes guaranteed.
  let bootstrapped = false;
  let previousFocused: string | null = null;
  const seenFocused = new Set<string>();

  for (const codePoint of alphabet) {
    if (keys.get(codePoint)!.included) {
      expect(
        keys.get(codePoint)!.uncalibrated,
        `expected initially-included key ${codePoint} to start uncalibrated (seed ${seed})`,
      ).toBe(true);
    }
  }

  while (keystrokes < MAX_KEYSTROKES && !allIncluded(keys, alphabet)) {
    const displayedChar = await page
      .locator(CURSOR_SELECTOR)
      .first()
      .textContent();
    const targetBeforeChar = await currentKeyCodePoint(page);
    const detailsBeforeChar =
      targetBeforeChar != null ? await currentKeyDetailsText(page) : null;
    const fumbled = random() < FUMBLE_PROBABILITY;
    if (fumbled) {
      await fumbleThenCorrect(page, displayedChar ?? "", random);
    } else {
      await sendChar(page, displayedChar ?? "");
    }
    keystrokes++;
    await page.waitForTimeout(delay);

    const signature = await roundTextSignature(page);
    if (fumbled && targetBeforeChar != null) {
      const targetAfterChar = await currentKeyCodePoint(page);
      if (
        targetAfterChar === targetBeforeChar &&
        // The fumble's correct char may complete the round; appending a
        // Result updates this key's samples from its other occurrences.
        signature === roundSignature
      ) {
        // Histogram.from() skips a typo'd step's timing sample, so a
        // fumble must not move this key's confidence.
        const detailsAfterChar = await currentKeyDetailsText(page);
        expect(
          detailsAfterChar,
          `expected fumbling ${targetBeforeChar} not to change its reported confidence (a miss records no timing sample), but it went from "${detailsBeforeChar}" to "${detailsAfterChar}" after ${keystrokes} keystrokes (seed ${seed})`,
        ).toEqual(detailsBeforeChar);
      }
    }

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
    // Only holds with default alphabetSize: 0 / recoverKeys: false;
    // GuidedLesson.update() can force several keys at once otherwise.
    const newlyIncluded = alphabet.filter(
      (cp) => !keys.get(cp)!.included && next.get(cp)!.included,
    );
    expect(
      newlyIncluded.length,
      `expected at most one newly-included key per round, got [${newlyIncluded}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toBeLessThanOrEqual(1);

    // The "force" branch only triggers when alphabetSize > 0.
    const forced = alphabet.filter((cp) => next.get(cp)!.forced);
    expect(
      forced,
      `expected no forced keys under default alphabetSize: 0, got [${forced}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toEqual([]);

    // "Current key" must match the key set's own focused key, and be
    // included.
    const focusedInSet = alphabet.filter((cp) => next.get(cp)!.focused);
    const currentFocused = await currentKeyCodePoint(page);
    expect(
      focusedInSet.length,
      `expected at most one focused key in the key set, got [${focusedInSet}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toBeLessThanOrEqual(1);
    expect(
      focusedInSet,
      `"Current key" (${currentFocused}) doesn't match the key set's focused key(s) [${focusedInSet}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toEqual(currentFocused == null ? [] : [currentFocused]);
    if (currentFocused != null) {
      expect(
        next.get(currentFocused)!.included,
        `target key ${currentFocused} isn't marked included after ${keystrokes} keystrokes (seed ${seed})`,
      ).toBe(true);
    }

    // A freshly-included key starts uncalibrated (weakest), so it must
    // immediately become the target.
    if (newlyIncluded.length === 1) {
      expect(
        currentFocused,
        `expected the newly-included key ${newlyIncluded[0]} to become the new target key, but the target key is ${currentFocused} after ${keystrokes} keystrokes (seed ${seed})`,
      ).toEqual(newlyIncluded[0]);

      // Toaster.tsx renders newest-first, so index 0 is this round's toast.
      const announced = await announcedCodePoints(page);
      expect(
        announced[0],
        `expected the newest "New letter unlocked" toast to be for ${newlyIncluded[0]}, got toasts for [${announced}] after ${keystrokes} keystrokes (seed ${seed})`,
      ).toEqual(newlyIncluded[0]);

      expect(
        next.get(newlyIncluded[0])!.uncalibrated,
        `expected freshly-included key ${newlyIncluded[0]} to start uncalibrated (no samples yet) after ${keystrokes} keystrokes (seed ${seed})`,
      ).toBe(true);

      bootstrapped = true;
    }

    if (bootstrapped && currentFocused !== previousFocused) {
      if (previousFocused != null) {
        expect(
          next.get(previousFocused)!.uncalibrated,
          `expected ${previousFocused} to have accumulated real timing samples before the target moved on, but it's still uncalibrated after ${keystrokes} keystrokes (seed ${seed})`,
        ).toBe(false);
      }
      if (currentFocused != null) {
        expect(
          seenFocused.has(currentFocused),
          `target key moved back to ${currentFocused}, which was already the target key earlier - it should only ever advance, never return, after ${keystrokes} keystrokes (seed ${seed})`,
        ).toBe(false);
        seenFocused.add(currentFocused);
      }
      previousFocused = currentFocused;
    }

    keys = next;
  }

  const stillExcluded = alphabet.filter((cp) => !keys.get(cp)!.included);
  expect(
    stillExcluded,
    `alphabet not fully unlocked within ${MAX_KEYSTROKES} keystrokes (seed ${seed}); still excluded: [${stillExcluded}]`,
  ).toEqual([]);
});

function allIncluded(
  keys: Map<string, KeySnapshot>,
  alphabet: readonly string[],
): boolean {
  return alphabet.every((cp) => keys.get(cp)!.included);
}

async function currentKeyCodePoint(page: Page): Promise<string | null> {
  const locator = page.locator(CURRENT_KEY_SELECTOR);
  if ((await locator.count()) === 0) {
    return null;
  }
  return locator.first().getAttribute("data-code-point");
}

async function currentKeyDetailsText(page: Page): Promise<string | null> {
  const locator = page.locator(CURRENT_KEY_DETAILS_SELECTOR);
  if ((await locator.count()) === 0) {
    return null;
  }
  return locator.first().textContent();
}

const ALPHANUMERIC_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomAlphanumericChar(random: () => number, exclude: string): string {
  let char: string;
  do {
    char = ALPHANUMERIC_CHARS[Math.floor(random() * ALPHANUMERIC_CHARS.length)];
  } while (char === exclude);
  return char;
}

// TextInput.appendChar() never turns a wrong char into a step; only the
// following correct char does, tagged Attr.Miss.
async function fumbleThenCorrect(
  page: Page,
  displayed: string,
  random: () => number,
): Promise<void> {
  const correct = SPACE_GLYPHS.has(displayed) ? " " : displayed;
  const wrong = randomAlphanumericChar(random, correct);
  await page.keyboard.type(wrong);
  await sendChar(page, displayed);
}
