---
"@saas/ui": minor
---

Component ↔ Figma parity for the form + container primitives (closes the remaining audit gaps after the Button pilot). Aligned to the design specimens of the `UI-Exercise` file, bound to semantic tokens (the DS stays brand-agnostic), AA preserved over pixel-fidelity:

- **Input**: taller field — `h-9 → h-11` (44px), `rounded-md → rounded-lg` (8px), `px-3 → px-4`.
- **Select** (trigger): default size matched to Input — `h-11`, `rounded-lg`, `px-4` (`sm` → `h-9`).
- **Card**: `rounded-xl → rounded-2xl` (12px → 16px corner).
- **Badge**: `rounded-md → rounded-full` (pill).

No public API changes. `Field` inherits the new `Input`. Avatar/Dialog/Toast/Label are documented as token-faithful (no Figma specimen). Soft status-badge tints were evaluated and deferred — 3 of 4 fail WCAG AA as text (see `ui/docs/figma-parity.md`).
