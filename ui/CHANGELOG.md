# @saas/ui

## 0.2.0

### Minor Changes

- a3ee6fd: Component ↔ Figma parity for the form + container primitives (closes the remaining audit gaps after the Button pilot). Aligned to the design specimens of the `UI-Exercise` file, bound to semantic tokens (the DS stays brand-agnostic), AA preserved over pixel-fidelity:
  - **Input**: taller field — `h-9 → h-11` (44px), `rounded-md → rounded-lg` (8px), `px-3 → px-4`.
  - **Select** (trigger): default size matched to Input — `h-11`, `rounded-lg`, `px-4` (`sm` → `h-9`).
  - **Card**: `rounded-xl → rounded-2xl` (12px → 16px corner).
  - **Badge**: `rounded-md → rounded-full` (pill).

  No public API changes. `Field` inherits the new `Input`. Avatar/Dialog/Toast/Label are documented as token-faithful (no Figma specimen). Soft status-badge tints were evaluated and deferred — 3 of 4 fail WCAG AA as text (see `ui/docs/figma-parity.md`).

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
