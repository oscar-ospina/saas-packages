import { defineConfig, devices } from "@playwright/test";

// Functional E2E of the static Storybook build: real keyboard navigation and
// automated accessibility (axe) per primitive — the half of epic #5's a11y
// criterion that visual regression can't cover (VR only proves pixels are
// stable, not that the DOM is operable by keyboard or passes ARIA/role checks).
//
// Kept separate from playwright.config.ts (visual regression) so the two
// concerns don't share screenshot settings or a server port. Runs in the same
// pinned Playwright container in CI as the VR job.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Real-browser interaction can be momentarily racy on a cold first paint;
  // one retry in CI absorbs that without masking a genuine regression.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:6012",
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx http-server storybook-static -p 6012 -a 127.0.0.1 -s -c-1",
    url: "http://127.0.0.1:6012",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
