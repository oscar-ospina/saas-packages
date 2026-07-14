---
"@saas/ui": minor
---

New selection primitives from the Alta Vibración "Selectors & chips" design: `Checkbox` and `RadioGroup`/`RadioGroupItem` (radix-ui, 22px controls) and `Chip` (44px toggle button with `aria-pressed`, for time-slot pickers). Backed by new semantic selection roles — `--color-selected` (orange-500) and `--color-selected-foreground` (orange-950) — chosen over the Figma orange-400/white pair to preserve AA (non-text 3:1, text 4.93:1); themes re-skin them like any other role.
