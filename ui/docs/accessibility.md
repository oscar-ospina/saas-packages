# Accessibility — color contrast audit

Scope: the semantic color layer in [`src/semantic.css`](../src/semantic.css), now
mapped to the **real Figma palette** (the "All palettes" frame → `src/tokens.css`),
audited against the foreground/background pairs the shipped components actually use.

> This audits **token parity**, not component parity. The roles map to real Figma
> tokens, but primitives don't yet pixel-match their Figma components (epic #5's
> "Component ↔ Figma parity" stays open). The Figma Variables registry isn't
> readable via the Framelink MCP, so the "All palettes" frame is the source.

## Method

- WCAG 2.x relative-luminance contrast ratio.
- **Thresholds:** body text **4.5:1** (1.4.3); large/bold text and non-text UI /
  state indicators **3:1** (1.4.11). `ring`, `border`, `input` judged at 3:1.
- `var()` chains resolved to hex (e.g. `--color-primary` → `orange-300` `#f8ad79`;
  `--color-foreground` → `text-primary` `#363744`).

## Results

| Pair (fg on bg)                            | Resolved               | Ratio   | Need | Result                    |
| ------------------------------------------ | ---------------------- | ------- | ---- | ------------------------- |
| foreground on background                   | `#363744` on `#f6f6f9` | 10.90:1 | 4.5  | ✅                        |
| foreground on card/popover (paper)         | `#363744` on `#ffffff` | 11.75:1 | 4.5  | ✅                        |
| primary-foreground on primary              | `#782516` on `#f8ad79` | 5.42:1  | 4.5  | ✅ (Figma's Button pair)  |
| primary-colored text (Button `link`)       | `#bb3313` on `#f6f6f9` | 5.41:1  | 4.5  | ✅ (orange-700, see note) |
| secondary/accent-foreground on neutral-100 | `#363744` on `#ededf1` | 10.07:1 | 4.5  | ✅                        |
| muted-foreground on muted                  | `#565973` on `#ededf1` | 5.85:1  | 4.5  | ✅                        |
| muted-foreground on background             | `#565973` on `#f6f6f9` | 6.34:1  | 4.5  | ✅                        |
| destructive-foreground on destructive      | `#ffffff` on `#e7000b` | 4.77:1  | 4.5  | ✅                        |
| destructive **text** on card (paper)       | `#e7000b` on `#ffffff` | 4.77:1  | 4.5  | ✅                        |
| **destructive text on app background**     | `#e7000b` on `#f6f6f9` | 4.42:1  | 4.5  | ⚠️ **finding**            |
| ring vs background                         | `#f0601f` on `#f6f6f9` | 3.04:1  | 3.0  | ✅                        |
| ring vs card                               | `#f0601f` on `#ffffff` | 3.28:1  | 3.0  | ✅                        |
| **border/input vs background**             | `#d7d8e0` on `#f6f6f9` | 1.32:1  | 3.0  | ⚠️ **finding**            |

## Findings & decisions

### Primary — Figma's own accessible Button pair

Figma's `Base/Primary` is **orange-400 `#f37d3e`** (the brand hue), but it fails AA
as a text surface (white = 2.7:1; dark text = 3.8:1). Figma's **Button component**
resolves this itself with **orange-300 `#f8ad79` bg + orange-900 `#782516` text
(5.42:1)** — so the `primary` _surface_ role uses exactly that pair. The brand hue
remains as `--color-orange-400` and drives the focus ring (`--color-ring` =
orange-500, 3.04:1). No invention, no override — this is the design's own answer.

**`--color-primary` is FILL-ONLY.** As a soft wash it's legible only _with_
`primary-foreground` on it; as standalone text (`text-primary`) it's ~1.9:1. So
primary-colored **text** (the Button `link` variant) uses **orange-700 `#bb3313`
(5.41:1 on bg, 5.84:1 on card)**, not `text-primary`. `semantic.css` flags this
inline so the pale fill is never reused as text.

### Destructive — faithful Figma red, with one documented finding

`--color-destructive` = Figma `Semantic/Red` **`#e7000b`** (the earlier `#dc2626`
a11y override is **dropped** — the faithful red clears AA where it matters: white
on it = 4.77:1, and as error text on a white card = 4.77:1).

**Finding:** error text (`text-destructive`) directly on the app background
`#f6f6f9` is **4.42:1** — marginally below AA. In practice error text sits on white
cards/inputs (4.77:1 ✅); on the bare page background it's a hair short. Faithful to
the Figma value, so **documented, not overridden** — the real fix is for the design
to darken `Semantic/Red` one step, or for error text to always sit on `paper`.

### border / input — documented finding, left as-is

Resting `border-input` (`neutral-200 #d7d8e0`) is **1.32:1** vs the background —
below 1.4.11's 3:1 for a component boundary. Left unchanged: the focus ring
(orange-500, 3.04:1) is the strong AA-passing state indicator, and a faint resting
border is the design's neutral-200 choice. Revisit if the design introduces a
dedicated input-border token.

## Automated checks (CI)

Two functional gates run on every PR in the pinned Playwright container
(`.github/workflows/visual.yml`), sharing one Storybook build:

- **Keyboard navigation** (`tests/e2e/keyboard.spec.ts`) — real-browser proof that the
  interactive primitives are operable by keyboard: Dialog opens on Enter, traps focus,
  closes on Escape and restores focus to its trigger; Select opens and commits a choice via
  Arrow/Enter and closes on Escape; a Field label focuses its control with the right
  `aria-invalid` / `aria-describedby` / `aria-required`; a Button is Tab-reachable and a
  disabled one is skipped; a Toast opens from the keyboard with a named, operable Close.
  This closes epic #5's "keyboard navigation … not yet E2E-verified" item.
- **axe accessibility** (`tests/e2e/a11y.spec.ts`) — `@axe-core/playwright` asserts **zero
  WCAG 2.2 A/AA violations** per primitive in accessible (labelled) usage. That includes the
  2.2-only `target-size` (2.5.8, 24×24px) rule — the Toast close (24px) and the `sm` Button
  clear it.

Scoped exclusions, so the gate stays meaningful rather than noisy:

- `color-contrast` is **off** in axe — contrast is audited by hand above (which knows the
  real fg/bg pairs each component uses and tracks the `border-input` / destructive-text
  findings). Running both would duplicate and disagree.
- axe **best-practice** rules (`region`, `landmark-one-main`, …) are excluded — they fire on
  a bare story iframe that has no page landmarks, a harness artifact, not a component defect.
- Select is scanned **labelled and closed**. A combobox takes its name from a label, not its
  placeholder, so the bare story is unlabelled by design (like `input--default`); the
  forced-`defaultOpen` story trips `aria-hidden-focus`, an upstream Radix open-state artifact
  (the trigger stays focusable under the aria-hidden applied to outside content while focus
  is trapped in the listbox). The open listbox's roles + keyboard are covered by the keyboard
  suite instead.

Found and fixed by the axe gate: the **Toast close button had no accessible name** (icon
only) — added an `sr-only` "Close", matching Dialog's close button.

## Reproduce

Resolve each `var()` to hex and apply the WCAG relative-luminance formula
(linearize sRGB, weight 0.2126/0.7152/0.0722, `(L_light+0.05)/(L_dark+0.05)`).
