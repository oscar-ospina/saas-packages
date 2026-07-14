# @saas/ui

## 0.3.0

### Minor Changes

- e5cf1c9: Button now styles exclusively through semantic roles: new `--color-emphasis`, `--color-link`, `--color-primary-hover`, and `--color-border-strong` tokens (semantic.css "Button emphasis roles") replace its raw ramp reaches (`text-orange-900`, `text-orange-700`, `hover:bg-orange-200`, `hover:border-neutral-300`). Rendered output is unchanged for the default brand; `.theme-*` role-only themes now fully re-skin Button (the theming-proof gap is closed).
- 81f502a: New `Calendar` component from the Alta Vibración "Calendar" design — a booking date picker built on react-day-picker (new dependency), Spanish/Monday-first by default. Selection uses the semantic selection roles; bookable days are exposed as an `available` modifier styled with new highlight roles (`--color-highlight` orange-50 / `--color-highlight-foreground` orange-700, 5.43:1 AA).
- 408b307: New selection primitives from the Alta Vibración "Selectors & chips" design: `Checkbox` and `RadioGroup`/`RadioGroupItem` (radix-ui, 22px controls) and `Chip` (44px toggle button with `aria-pressed`, for time-slot pickers). Backed by new semantic selection roles — `--color-selected` (orange-500) and `--color-selected-foreground` (orange-950) — chosen over the Figma orange-400/white pair to preserve AA (non-text 3:1, text 4.93:1); themes re-skin them like any other role.

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
