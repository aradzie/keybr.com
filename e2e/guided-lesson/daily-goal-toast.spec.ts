import { expect, test } from "@playwright/test";
import {
  CURSOR_SELECTOR,
  MAX_KEYSTROKES,
  roundTextSignature,
  sendChar,
  TOASTER_SELECTOR,
} from "./helpers.ts";

test("reaching the daily goal shows a 'Daily goal reached!' toast", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        "lesson.type": "guided",
        "keyboard.layout": "en-us",
        // Minutes; tiny so the goal is crossed the instant the first
        // round's Result is recorded.
        "lesson.dailyGoal": 0.001,
      }),
    );
  });

  await page.goto("/");
  await expect(page.locator("[data-code-point]").first()).toBeVisible();
  await page.locator("textarea").first().focus();

  const cursor = page.locator(CURSOR_SELECTOR).first();
  let roundSignature = await roundTextSignature(page);
  for (
    let i = 0;
    i < MAX_KEYSTROKES && (await roundTextSignature(page)) === roundSignature;
    i++
  ) {
    const displayed = await cursor.textContent();
    await sendChar(page, displayed ?? "");
    // Histogram.validateSample() rejects samples under 40ms as implausibly
    // fast (anti-cheat), which would make the whole Result invalid.
    await page.waitForTimeout(50);
  }

  await expect(
    page.locator(TOASTER_SELECTOR).getByText("Daily goal reached!"),
  ).toBeVisible();
});
