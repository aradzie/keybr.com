import { expect, test } from "@playwright/test";
import { CURSOR_SELECTOR, sendChar, SPACE_GLYPHS } from "./helpers.ts";

const POINTER_SELECTOR = '[class*="PointersLayer-module__pointer"]';

test("the highlighted next key points at the correct on-screen key", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        "lesson.type": "guided",
        "keyboard.layout": "en-us",
        "keyboard.pointers": true,
      }),
    );
  });

  await page.goto("/");
  await expect(page.locator("[data-code-point]").first()).toBeVisible();
  await page.locator("textarea").first().focus();

  const cursor = page.locator(CURSOR_SELECTOR).first();
  const KEYS_TO_CHECK = 5;
  for (let i = 0; i < KEYS_TO_CHECK; i++) {
    const displayed = (await cursor.textContent()) ?? "";
    const expectedKeyId = SPACE_GLYPHS.has(displayed)
      ? "Space"
      : `Key${displayed.toUpperCase()}`;

    // The pointer only appears after some hesitation delay, so poll
    // rather than assume a fixed one.
    const pointer = page.locator(POINTER_SELECTOR).first();
    await expect(pointer).toBeVisible({ timeout: 5000 });
    // It fades in via an SVG animation; let it settle before measuring.
    await page.waitForTimeout(200);
    const pointerBox = await pointer.boundingBox();
    const keyBox = await page
      .locator(`[data-key="${expectedKeyId}"]`)
      .boundingBox();
    expect(pointerBox, "pointer circle has no bounding box").not.toBeNull();
    expect(
      keyBox,
      `no on-screen key found for ${expectedKeyId}`,
    ).not.toBeNull();

    const cx = pointerBox!.x + pointerBox!.width / 2;
    const cy = pointerBox!.y + pointerBox!.height / 2;
    expect(
      cx >= keyBox!.x && cx <= keyBox!.x + keyBox!.width,
      `expected pointer center x=${cx} to fall within key ${expectedKeyId}'s box [${keyBox!.x}, ${keyBox!.x + keyBox!.width}]`,
    ).toBe(true);
    expect(
      cy >= keyBox!.y && cy <= keyBox!.y + keyBox!.height,
      `expected pointer center y=${cy} to fall within key ${expectedKeyId}'s box [${keyBox!.y}, ${keyBox!.y + keyBox!.height}]`,
    ).toBe(true);

    await sendChar(page, displayed);
    // Otherwise the next iteration could check the pointer before the app
    // has cleared this character's own pointer.
    await expect(cursor).not.toHaveText(displayed);
  }
});
