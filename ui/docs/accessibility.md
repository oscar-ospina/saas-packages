# Accessibility — color contrast audit

Scope: the **provisional** semantic color layer in [`src/semantic.css`](../src/semantic.css),
audited against the foreground/background pairs the shipped components actually use
(enumerated from the `bg-*` / `text-*` / `border-*` / `ring-*` utilities in `src/components/`).

> ⚠️ This audits the _invented_ v0 palette, not a Figma-derived one. It does **not**
> close follow-up #1 ("real Figma-derived semantic palette"). When that lands, re-run
> this audit against the new values.

## Method

- WCAG 2.x relative-luminance contrast ratio.
- **Thresholds:** body text **4.5:1** (1.4.3); large/bold text and non-text UI
  components/state indicators **3:1** (1.4.11). `ring-*`, `border-input` are judged
  at 3:1.
- All `var()` chains resolved to their final hex (e.g. `--color-foreground` →
  `slate-900` → `#0f172a`; `--color-primary` → `m3-sys-light-primary` → `#65558f`).

## Results (after fixes)

| Pair (fg on bg)                                | Resolved               | Ratio   | Need | Result                     |
| ---------------------------------------------- | ---------------------- | ------- | ---- | -------------------------- |
| foreground / card-fg / popover-fg on white     | `#0f172a` on `#ffffff` | 17.85:1 | 4.5  | ✅                         |
| secondary-fg on secondary                      | `#0f172a` on `#f1f5f9` | 16.30:1 | 4.5  | ✅                         |
| accent-fg on accent                            | `#0f172a` on `#f1f5f9` | 16.30:1 | 4.5  | ✅                         |
| primary-fg on primary                          | `#ffffff` on `#65558f` | 6.46:1  | 4.5  | ✅                         |
| primary text on background                     | `#65558f` on `#ffffff` | 6.46:1  | 4.5  | ✅                         |
| **muted-foreground on white**                  | `#475569` on `#ffffff` | 7.58:1  | 4.5  | ✅ (was 4.76, slate-500)   |
| **muted-foreground on muted/secondary/accent** | `#475569` on `#f1f5f9` | 6.92:1  | 4.5  | ✅ **fixed** (was 4.34 ❌) |
| **destructive-fg on destructive**              | `#ffffff` on `#dc2626` | 4.83:1  | 4.5  | ✅ **fixed** (was 4.32 ❌) |
| **destructive text on background**             | `#dc2626` on `#ffffff` | 4.83:1  | 4.5  | ✅ **fixed** (was 4.32 ❌) |
| ring (primary) vs background                   | `#65558f` on `#ffffff` | 6.46:1  | 3.0  | ✅                         |
| ring-destructive vs background                 | `#dc2626` on `#ffffff` | 4.83:1  | 3.0  | ✅                         |
| **border-input vs background**                 | `#e2e8f0` on `#ffffff` | 1.23:1  | 3.0  | ⚠️ **documented finding**  |

## Findings & decisions

### 1. `muted-foreground` — fixed (invented mapping)

`slate-500` on a `slate-100` surface was **4.34:1** (below AA). The role→value mapping
is invented, so it was moved to **`slate-600` (`#475569`)**, which clears AA on both
white (7.58:1) and slate-100 (6.92:1). No divergence from any design source.

### 2. `destructive` — intentional a11y override

Figma exposes exactly one red, `--color-light-red-base` (`#e92c2c`), and it **fails AA
in both directions** destructive is used: white text on it (buttons/toasts) = 4.32:1,
and as text on white (error messages, `text-destructive`) = 4.32:1.

The destructive→red _role mapping_ is invented (like everything in this layer), so the
role now uses **`#dc2626`** (4.83:1 both directions) — a deliberate, documented
accessibility override, **not** the Figma value. This is a stopgap: follow-up #1
(real Figma palette) supersedes it and must re-verify contrast then. This override does
**not** close that follow-up.

### 3. `border-input` — documented finding, left as-is

An input's resting border (`#e2e8f0`) is **1.23:1** vs white — below 1.4.11's 3:1 for a
component boundary. Left unchanged on purpose:

- The **focus ring** (`ring-ring`, 6.46:1) is the strong, AA-passing state indicator.
- The low-contrast resting border is shadcn's intended visual language; restyling it
  here would diverge heavily and isn't clearly required (the field is also identified by
  its label and layout, not the border alone).

Revisit when follow-up #1 establishes real surface/border tokens; that's the right place
to decide whether resting input borders should meet 3:1.

## Reproduce

The ratios above are mechanical. Resolve each `var()` to hex and apply the WCAG
relative-luminance formula (a ~15-line script: linearize sRGB channels, weight
0.2126/0.7152/0.0722, `(L_light + 0.05) / (L_dark + 0.05)`).
