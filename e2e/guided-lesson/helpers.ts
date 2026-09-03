import { type Page } from "@playwright/test";
import Rand, { PRNG } from "rand-seed";

export const CURSOR_SELECTOR = '[class*="chars-module__cursor"]';
export const KEY_SET_SELECTOR = '[id*="keySet"] [data-code-point]';
export const TOASTER_SELECTOR = '[class*="Toaster-module__toaster"]';
export const ANNOUNCEMENT_KEY_SELECTOR = `${TOASTER_SELECTOR} [data-code-point]`;
// Scoped past the TextArea wrapper, whose own status messages flicker
// independently of the round.
export const ROUND_SIGNATURE_SELECTOR = '[class*="TextLines-module__root"]';

export const MAX_KEYSTROKES = 10000;
export const MIN_DELAY_MS = 5;
export const MAX_DELAY_MS = 60;

// chars.tsx's specialChar() substitutes these for whitespace; map back to a
// real space to send.
export const SPACE_GLYPHS = new Set(["\u00A0", "\uE000", "\uE001"]); // nbsp, bullet, bar

// Deterministic PRNG so a failing run's seed can be logged and replayed.
export function mulberry32(seed: number): () => number {
  const rand = new Rand(String(seed), PRNG.mulberry32);
  return () => rand.next();
}

export function randomDelay(random: () => number): number {
  return MIN_DELAY_MS + random() * (MAX_DELAY_MS - MIN_DELAY_MS);
}

export type KeySnapshot = {
  readonly included: boolean;
  readonly focused: boolean;
  readonly secondFocused: boolean;
  readonly uncalibrated: boolean;
  readonly forced: boolean;
};

export async function snapshotKeys(
  page: Page,
): Promise<Map<string, KeySnapshot>> {
  const entries = await page.locator(KEY_SET_SELECTOR).evaluateAll((els) =>
    els.map((el) => [
      el.getAttribute("data-code-point")!,
      {
        included: el.className.includes("lessonKey_included"),
        focused: el.className.includes("lessonKey_focused"),
        // Not gated by isIncluded, unlike lessonKey_focused -- can land on
        // an excluded key (the previewed next-in-line letter).
        secondFocused: el.className.includes("lessonKey_secondFocused"),
        uncalibrated: el.className.includes("lessonKey_uncalibrated"),
        forced: el.className.includes("lessonKey_forced"),
      },
    ]),
  );
  return new Map(entries as [string, KeySnapshot][]);
}

export async function announcedCodePoints(page: Page): Promise<string[]> {
  return page
    .locator(ANNOUNCEMENT_KEY_SELECTOR)
    .evaluateAll((els) => els.map((el) => el.getAttribute("data-code-point")!));
}

// Confirms a settings change reached localStorage - a downstream-effect
// invariant alone can pass even when the write silently no-ops.
export async function readAppliedSettings(
  page: Page,
): Promise<Record<string, unknown>> {
  const raw = await page.evaluate(() => localStorage.getItem("settings"));
  return raw == null ? {} : JSON.parse(raw);
}

export async function roundTextSignature(page: Page): Promise<string> {
  return page
    .locator(ROUND_SIGNATURE_SELECTOR)
    .evaluate((el) => el.textContent ?? "");
}

export async function sendChar(page: Page, displayed: string): Promise<void> {
  if (SPACE_GLYPHS.has(displayed)) {
    await page.keyboard.type(" ");
  } else {
    await page.keyboard.type(displayed);
  }
}
