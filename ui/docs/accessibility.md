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

| Pair (fg on bg)                            | Resolved               | Ratio   | Need | Result                   |
| ------------------------------------------ | ---------------------- | ------- | ---- | ------------------------ |
| foreground on background                   | `#363744` on `#f6f6f9` | 10.90:1 | 4.5  | ✅                       |
| foreground on card/popover (paper)         | `#363744` on `#ffffff` | 11.75:1 | 4.5  | ✅                       |
| primary-foreground on primary              | `#782516` on `#f8ad79` | 5.42:1  | 4.5  | ✅ (Figma's Button pair) |
| secondary/accent-foreground on neutral-100 | `#363744` on `#ededf1` | 10.07:1 | 4.5  | ✅                       |
| muted-foreground on muted                  | `#565973` on `#ededf1` | 5.85:1  | 4.5  | ✅                       |
| muted-foreground on background             | `#565973` on `#f6f6f9` | 6.34:1  | 4.5  | ✅                       |
| destructive-foreground on destructive      | `#ffffff` on `#e7000b` | 4.77:1  | 4.5  | ✅                       |
| destructive **text** on card (paper)       | `#e7000b` on `#ffffff` | 4.77:1  | 4.5  | ✅                       |
| **destructive text on app background**     | `#e7000b` on `#f6f6f9` | 4.42:1  | 4.5  | ⚠️ **finding**           |
| ring vs background                         | `#f0601f` on `#f6f6f9` | 3.04:1  | 3.0  | ✅                       |
| ring vs card                               | `#f0601f` on `#ffffff` | 3.28:1  | 3.0  | ✅                       |
| **border/input vs background**             | `#d7d8e0` on `#f6f6f9` | 1.32:1  | 3.0  | ⚠️ **finding**           |

## Findings & decisions

### Primary — Figma's own accessible Button pair

Figma's `Base/Primary` is **orange-400 `#f37d3e`** (the brand hue), but it fails AA
as a text surface (white = 2.7:1; dark text = 3.8:1). Figma's **Button component**
resolves this itself with **orange-300 `#f8ad79` bg + orange-900 `#782516` text
(5.42:1)** — so the `primary` _surface_ role uses exactly that pair. The brand hue
remains as `--color-orange-400` and drives the focus ring (`--color-ring` =
orange-500, 3.04:1). No invention, no override — this is the design's own answer.

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

## Reproduce

Resolve each `var()` to hex and apply the WCAG relative-luminance formula
(linearize sRGB, weight 0.2126/0.7152/0.0722, `(L_light+0.05)/(L_dark+0.05)`).
