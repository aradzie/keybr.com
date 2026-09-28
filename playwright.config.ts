import { defineConfig } from "@playwright/test";

try {
  process.loadEnvFile(".env");
} catch (err: any) {
  if (err.code !== "ENOENT") {
    throw err;
  }
}

// Unset by default, so Playwright falls back to its own installed browser
// (`npx playwright install chromium`); set locally to point at some other
// chromium build instead
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? undefined;

// Launch arguments for the test run
const launchArgs = process.env.PLAYWRIGHT_LAUNCH_ARGS?.split(",") ?? [];

// Base URL to test against
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL,
    launchOptions: {
      executablePath,
      args: launchArgs,
    },
  },
  projects: [
    {
      name: "smoke",
      testMatch: "smoke.spec.ts",
    },
    {
      name: "e2e",
      testMatch: "guided-lesson/**/*.spec.ts",
      dependencies: ["smoke"],
    },
  ],
  webServer: {
    // CSS module class names (used throughout these tests as selectors)
    // are only human-readable in a development build; a stale production
    // build would make every selector silently fail to match.
    command: "npm run build-dev && npm start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
