---
"@saas/ui": patch
---

Toast: give the close button an accessible name. The icon-only close button
had no discernible text, so screen readers announced it as an unlabeled
button — it now includes an `sr-only` "Close" label, matching Dialog's close.

(Surfaced by the new keyboard + axe WCAG 2.2 AA accessibility gate; that gate is
test-only and has no consumer-facing impact.)
