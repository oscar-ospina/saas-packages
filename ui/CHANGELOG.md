# @saas/ui

## 0.1.1

### Patch Changes

- b9b3eda: Toast: give the close button an accessible name. The icon-only close button
  had no discernible text, so screen readers announced it as an unlabeled
  button — it now includes an `sr-only` "Close" label, matching Dialog's close.

  (Surfaced by the new keyboard + axe WCAG 2.2 AA accessibility gate; that gate is
  test-only and has no consumer-facing impact.)

## 0.1.0

### Minor Changes

- Initial release of the `@saas/ui` design system: Figma-generated design tokens
  (Tailwind v4 `@theme`) plus the foundational primitives — Button, Badge, Card,
  Input, Label, Field, Avatar, Select, Dialog, and Toast — built on Radix UI with
  shadcn-derived sources. ESM-only, ships TSX source + types + `theme.css`.
