import { expect, test } from "@playwright/test";

test("practice page loads and accepts typed input", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-code-point]").first()).toBeVisible();

  await page.locator("textarea").first().focus();
  const textArea = page.locator('[class*="TextArea-module__root"]');
  const before = await textArea.innerHTML();

  const expectedChar = await page
    .locator('[class*="chars-module__cursor"]')
    .first()
    .textContent();
  await page.keyboard.type(expectedChar ?? "");

  await expect(async () => {
    expect(await textArea.innerHTML()).not.toEqual(before);
  }).toPass();
});
