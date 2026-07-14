---
"@saas/ui": minor
---

Button now styles exclusively through semantic roles: new `--color-emphasis`, `--color-link`, `--color-primary-hover`, and `--color-border-strong` tokens (semantic.css "Button emphasis roles") replace its raw ramp reaches (`text-orange-900`, `text-orange-700`, `hover:bg-orange-200`, `hover:border-neutral-300`). Rendered output is unchanged for the default brand; `.theme-*` role-only themes now fully re-skin Button (the theming-proof gap is closed).
