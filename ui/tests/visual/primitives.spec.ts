import { expect, test } from "@playwright/test";

// One baseline per primitive (and the token foundations). Open states are used
// for portal-based primitives so the rendered surface is captured.
const STORIES = [
  "foundations-tokens--tokens",
  "components-button--all-variants",
  "components-button--sizes",
  "components-badge--all-variants",
  "components-card--default",
  "components-input--default",
  "components-input--invalid",
  "components-field--with-error",
  "components-avatar--group",
  "components-select--open",
  "components-dialog--open",
  "components-toast--destructive",
  "components-checkbox--all-states",
  "components-radiogroup--default",
  "components-chip--time-slots",
];

for (const id of STORIES) {
  test(id, async ({ page }) => {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    // Let Storybook render and fonts settle before snapshotting.
    await page.waitForSelector("#storybook-root, #root");
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${id}.png`, { fullPage: true });
  });
}
