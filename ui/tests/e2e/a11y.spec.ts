import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Automated accessibility gate: runs axe-core against each primitive in an
// accessible, composed usage (the way it's meant to ship) and fails on any
// WCAG 2.2 A/AA violation (the 2.0/2.1 rules are included too).
//
// Scope decisions:
//  • WCAG A/AA tags only — axe "best-practice" rules (region, landmark-one-main,
//    page-has-heading-one) fire on a bare story iframe that has no page
//    landmarks; those are harness artifacts, not component defects.
//  • color-contrast is disabled here because it's audited far more precisely by
//    hand in docs/accessibility.md (which knows the real fg/bg pairs each
//    component uses, and tracks the documented border-input / destructive-text
//    findings). Leaving it on would duplicate and contradict that audit.
//  • Bare unlabeled controls (input--default) are intentionally excluded — the
//    Input primitive is labelled via Field, so the Field stories are the
//    accessible-usage representatives.
//  • Select is scanned via its labelled story, not the bare/forced-open ones. A
//    combobox needs a name from a label (the placeholder is the value, not a
//    name), so the bare story is unlabelled by design — like input--default.
//    And the forced-`defaultOpen` story trips aria-hidden-focus (an upstream
//    Radix open-state artifact: the trigger stays focusable under the aria-hidden
//    applied to outside content while focus is trapped in the listbox). The open
//    listbox's roles/keyboard are covered by keyboard.spec.ts instead.
const STORIES = [
  "components-button--all-variants",
  "components-badge--all-variants",
  "components-card--default",
  "components-field--with-hint",
  "components-field--with-error",
  "components-avatar--group",
  "components-select--with-label",
  "components-dialog--open",
  "components-toast--destructive",
];

// Through WCAG 2.2 AA — epic #5's criterion is 2.2, so the 2.2-only rules
// (notably target-size, 2.5.8) must be in scope, not just 2.0/2.1.
const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForSelector("#storybook-root, #root");
  await page.evaluate(() => document.fonts.ready);
}

for (const id of STORIES) {
  test(`a11y: ${id} has no WCAG 2.2 A/AA violations`, async ({ page }) => {
    await gotoStory(page, id);
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_AA)
      .disableRules(["color-contrast"])
      .analyze();

    // Surface offending rules in the failure message, not just a count.
    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
}
