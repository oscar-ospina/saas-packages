import { expect, test, type Page } from "@playwright/test";

// Keyboard-operability E2E for the interactive primitives. Epic #5 lists
// "keyboard navigation" as a criterion that was provided by Radix but not yet
// verified end-to-end — this is that verification. It drives the real rendered
// Storybook (Chromium), not jsdom, because focus trapping, focus restoration
// and Radix's roving-tabindex only behave correctly with real focus events.

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForSelector("#storybook-root, #root");
  await page.evaluate(() => document.fonts.ready);
}

const focusIsInside = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => el.contains(document.activeElement));

test("Dialog: opens on Enter, traps focus, Escape closes and restores focus", async ({ page }) => {
  await gotoStory(page, "components-dialog--default");

  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.focus();
  await expect(trigger).toBeFocused();

  // Open with the keyboard (the trigger is a Button — this also proves a Button
  // activates via Enter).
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Delete project?");

  // Focus moved into the dialog…
  expect(await focusIsInside(page, '[role="dialog"]')).toBe(true);

  // …and stays trapped there while tabbing through its controls.
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  expect(await focusIsInside(page, '[role="dialog"]')).toBe(true);

  // Escape closes it and returns focus to the trigger.
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("Select: opens, ArrowDown + Enter selects an option via keyboard", async ({ page }) => {
  await gotoStory(page, "components-select--default");

  const trigger = page.getByRole("combobox");
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await expect(trigger).toContainText("Select a fruit");

  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeVisible();

  // Highlight and commit an option with the keyboard only.
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("listbox")).toHaveCount(0);
  await expect(trigger).toContainText(/Apple|Banana|Blueberry|Grapes/);
  // Radix returns focus to the trigger after committing.
  await expect(trigger).toBeFocused();

  // Re-open and Escape closes without changing the value.
  const committed = (await trigger.textContent())?.trim();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  expect((await trigger.textContent())?.trim()).toBe(committed);
});

test("Field: label focuses the input and aria-* wiring is correct", async ({ page }) => {
  await gotoStory(page, "components-field--with-error");

  const input = page.getByRole("textbox");

  // Clicking the label moves focus to the control (htmlFor ↔ id).
  await page.locator('label[for="email-error-demo"]').click();
  await expect(input).toBeFocused();

  // The error state is announced through aria-invalid + aria-describedby.
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAttribute("aria-required", "true");
  const describedBy = (await input.getAttribute("aria-describedby")) ?? "";
  expect(describedBy).toContain("email-error-demo-error");
  await expect(page.locator("#email-error-demo-error")).toHaveText(
    "Enter a valid email address.",
  );
});

test("Button: reachable by Tab; disabled is skipped and not operable", async ({ page }) => {
  await gotoStory(page, "components-button--default");
  const button = page.getByRole("button", { name: "Button" });
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();

  await gotoStory(page, "components-button--disabled");
  const disabled = page.getByRole("button", { name: "Button" });
  await expect(disabled).toBeDisabled();
  await page.keyboard.press("Tab");
  await expect(disabled).not.toBeFocused();
});

test("Toast: opens via the keyboard with an operable close button", async ({ page }) => {
  await gotoStory(page, "components-toast--default");

  const showToast = page.getByRole("button", { name: "Show toast" });
  await showToast.focus();
  await page.keyboard.press("Enter");

  const toast = page.getByRole("status");
  await expect(toast).toBeVisible();
  await expect(toast).toContainText("Changes saved");

  // The close control must be reachable and named for assistive tech.
  const close = page.getByRole("button", { name: "Close" });
  await expect(close).toBeVisible();
  await close.click();
  await expect(page.getByRole("status")).toHaveCount(0);
});
