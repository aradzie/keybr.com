import { expect, test } from "@playwright/test";
import { CURSOR_SELECTOR, sendChar } from "./helpers.ts";

test("a corrected mistake renders in the miss color", async ({ page }) => {
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

  const cursor = page.locator(CURSOR_SELECTOR).first();
  const expected = (await cursor.textContent()) ?? "";
  const wrong = expected === "j" ? "k" : "j";

  // Default settings reject a single wrong keystroke without moving the
  // cursor (TextInput.appendChar()).
  await page.keyboard.type(wrong);
  await expect(cursor).toHaveText(expected);

  await sendChar(page, expected);

  // A step preceded by a typo is marked Attr.Miss even once corrected,
  // rendered as its own single-character span right before the cursor.
  // Asserted via this sibling rather than "cursor text changed", since the
  // round's own (unseeded) text can repeat expected right after itself.
  const missed = page
    .locator(CURSOR_SELECTOR)
    .locator("xpath=preceding-sibling::*[1]");
  await expect(missed).toHaveText(expected);
  const color = await missed.evaluate((el) => (el as HTMLElement).style.color);
  expect(color).toBe("var(--textinput--miss__color)");
});
