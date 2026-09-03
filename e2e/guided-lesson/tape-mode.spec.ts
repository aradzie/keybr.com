import { expect, type Page, test } from "@playwright/test";
import {
  CURSOR_SELECTOR,
  readAppliedSettings,
  ROUND_SIGNATURE_SELECTOR,
  sendChar,
} from "./helpers.ts";

const KEYSTROKES = 12;

// The tape container is an ancestor of the cursor char that clips the text.
// It carries a data-tape attribute, but accept the inline overflow style too.
async function tapeContainerCenter(page: Page): Promise<number | null> {
  return page
    .locator(CURSOR_SELECTOR)
    .first()
    .evaluate((el) => {
      let node: HTMLElement | null = el.parentElement;
      while (
        node != null &&
        node.getAttribute("data-tape") == null &&
        node.style.overflow !== "hidden"
      ) {
        node = node.parentElement;
      }
      if (node == null) {
        return null;
      }
      const rect = node.getBoundingClientRect();
      return rect.left + rect.width / 2;
    });
}

async function startTapeMode(
  page: Page,
  tapeModeStyle: "letter" | "word",
): Promise<void> {
  await page.addInitScript((tapeModeStyle) => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        "lesson.type": "guided",
        "keyboard.layout": "en-us",
        "textDisplay.tapeModeStyle": tapeModeStyle,
      }),
    );
  }, tapeModeStyle);
  await page.goto("/");
  await expect(page.locator("[data-code-point]").first()).toBeVisible();
  await page.locator("textarea").first().focus();
  expect(
    (await readAppliedSettings(page))["textDisplay.tapeModeStyle"],
    "expected the tape mode setting to have actually taken effect",
  ).toBe(tapeModeStyle);
}

async function typeAndAssert(
  page: Page,
  assert: (page: Page) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < KEYSTROKES; i++) {
    const displayedChar = await page
      .locator(CURSOR_SELECTOR)
      .first()
      .textContent();
    await sendChar(page, displayedChar ?? "");
    await assert(page);
  }
}

async function assertCursorCentered(page: Page): Promise<void> {
  await expect(async () => {
    const center = await tapeContainerCenter(page);
    expect(center, "expected the tape container to be present").not.toBeNull();
    const box = await page.locator(CURSOR_SELECTOR).first().boundingBox();
    expect(box, "expected the cursor char to be visible").not.toBeNull();
    expect(
      Math.abs(box!.x + box!.width / 2 - center!),
      "expected the cursor char to stay centered",
    ).toBeLessThanOrEqual(10);
  }).toPass({ timeout: 5000 });
}

async function assertWordCentered(page: Page): Promise<void> {
  await expect(async () => {
    const center = await tapeContainerCenter(page);
    expect(center, "expected the tape container to be present").not.toBeNull();
    const box = await page
      .locator(CURSOR_SELECTOR)
      .first()
      .evaluate((el) => {
        const rect = el.parentElement!.getBoundingClientRect();
        return { left: rect.left, width: rect.width };
      });
    expect(
      Math.abs(box.left + box.width / 2 - center!),
      "expected the current word to stay centered",
    ).toBeLessThanOrEqual(10);
  }).toPass({ timeout: 5000 });
}

test("tape mode centers the cursor in letter mode and the word in word mode", async ({
  page,
}) => {
  // Letter mode follows the character, so the cursor char itself is pinned.
  await startTapeMode(page, "letter");
  await typeAndAssert(page, assertCursorCentered);

  // Word mode only scrolls at word boundaries, so the current word is
  // centered and the cursor rides along inside it.
  await startTapeMode(page, "word");
  await typeAndAssert(page, assertWordCentered);

  const tops = await page
    .locator(ROUND_SIGNATURE_SELECTOR)
    .first()
    .evaluate((el) => {
      const tops = new Set<number>();
      for (const child of el.children) {
        tops.add(Math.round(child.getBoundingClientRect().top));
      }
      return [...tops];
    });
  expect(
    tops.length,
    `expected all words of the round to share a single line, got tops ${tops}`,
  ).toBe(1);
});
