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
} from "./helpers.ts";

const CURRENT_KEY_SELECTOR = '[id*="currentKey"] [data-code-point]';

test("trainSecondKey previews and unlocks the full alphabet one key per round", async ({
  page,
}) => {
  // Sized like the plain alphabet-unlock run - trainSecondKey's turn-based
  // path unlocks at the same pace, it just also previews a second key.
  test.setTimeout(15 * 60_000);

  const seed = Number(process.env.FUZZ_SEED) || Date.now();
  console.log(
    `train-second-key seed: ${seed} (rerun with FUZZ_SEED=${seed} to replay)`,
  );
  const random = mulberry32(seed);

  await page.addInitScript(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        "lesson.type": "guided",
        "keyboard.layout": "en-us",
        "lesson.guided.trainSecondKey": true,
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

  while (keystrokes < MAX_KEYSTROKES && !allIncluded(keys, alphabet)) {
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

    // masteredElsewhere is capped by turnBasedUnlock (guided.ts), so this
    // holds under trainSecondKey too, not just the baseline path.
    const newlyIncluded = alphabet.filter(
      (cp) => !keys.get(cp)!.included && next.get(cp)!.included,
    );
    expect(
      newlyIncluded.length,
      `expected at most one newly-included key per round even with trainSecondKey on, got [${newlyIncluded}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toBeLessThanOrEqual(1);

    const forced = alphabet.filter((cp) => next.get(cp)!.forced);
    expect(
      forced,
      `expected no forced keys under default alphabetSize: 0, got [${forced}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toEqual([]);

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

    // At most one second-focused key, unlike lessonKey_focused it may sit
    // on a still-excluded (previewed) key.
    const secondFocusedInSet = alphabet.filter(
      (cp) => next.get(cp)!.secondFocused,
    );
    expect(
      secondFocusedInSet.length,
      `expected at most one second-focused key, got [${secondFocusedInSet}] after ${keystrokes} keystrokes (seed ${seed})`,
    ).toBeLessThanOrEqual(1);
    const secondFocused = secondFocusedInSet[0] ?? null;
    if (secondFocused != null) {
      expect(
        secondFocused,
        `second-focused key ${secondFocused} must never be the same as the primary focused key after ${keystrokes} keystrokes (seed ${seed})`,
      ).not.toEqual(currentFocused);
      if (!next.get(secondFocused)!.included) {
        // Only the true next-in-line letter is ever previewed while locked
        // (guided.ts's nextKey) -- a deeper locked letter never competes,
        // so this is exactly what the user should see highlighted.
        const nextKeyExpected = alphabet.find((cp) => !next.get(cp)!.included);
        expect(
          secondFocused,
          `expected the locked second-focused key to be the true next-in-line letter ${nextKeyExpected}, got ${secondFocused} after ${keystrokes} keystrokes (seed ${seed})`,
        ).toEqual(nextKeyExpected);
      } else {
        // Only nextKey may compete with zero samples; an already-included
        // trailing key winning the slot must have real evidence behind it.
        expect(
          next.get(secondFocused)!.uncalibrated,
          `expected an already-included second-focused key ${secondFocused} to have real samples, not be uncalibrated, after ${keystrokes} keystrokes (seed ${seed})`,
        ).toBe(false);
      }
    }

    if (newlyIncluded.length === 1) {
      // A freshly-included key becomes the target, unless it was the very
      // last excluded letter -- guided.ts leaves focus dark once nothing
      // remains to work on, matching "All keys are unlocked."
      if (!allIncluded(next, alphabet)) {
        expect(
          currentFocused,
          `expected the newly-included key ${newlyIncluded[0]} to become the new target key, but the target key is ${currentFocused} after ${keystrokes} keystrokes (seed ${seed})`,
        ).toEqual(newlyIncluded[0]);
      }

      // Toaster.tsx renders newest-first, so index 0 is this round's toast.
      const announced = await announcedCodePoints(page);
      expect(
        announced[0],
        `expected the newest "New letter unlocked" toast to be for ${newlyIncluded[0]}, got toasts for [${announced}] after ${keystrokes} keystrokes (seed ${seed})`,
      ).toEqual(newlyIncluded[0]);

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

  // Proves a key deferred by the one-per-round cap (masteredElsewhere
  // losing out to a competing turn-based unlock) isn't lost - it must
  // still unlock on some later round, not get stuck excluded forever.
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
