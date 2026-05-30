import { defineConfig, devices } from "@playwright/test";

// Visual-regression of the static Storybook build — one screenshot per primitive
// story (the parity mechanism from the stack ADR). Determinism levers: fixed
// viewport/DPR, animations disabled, fonts awaited (see tests/visual/*.spec.ts).
//
// NOTE: screenshots are OS/font-sensitive. Baselines committed here are generated
// on Linux; CI runs in the official Playwright container so the environment
// matches. Regenerate with `npm run test:visual:update` in that container if the
// font stack differs.
export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:6011",
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.01,
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx http-server storybook-static -p 6011 -a 127.0.0.1 -s -c-1",
    url: "http://127.0.0.1:6011",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
