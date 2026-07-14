# Figma parity status

Source of truth: the **UI Exercise** Figma file (`i4WmV5Gfk9uivVQXC5NY8j`), read via
the Framelink MCP. Limitation: the Figma **Variables registry isn't readable** through
the MCP (`boundVariables=0`), so the documented frames ("All palettes", the Button
component sets) are the best _accessible_ source.

## Tokens — parity ✅

Color is extracted from the "All palettes" frame (`scripts/lib/figma-palette-frame.mjs`);
`semantic.css` maps shadcn roles to those tokens. See [`accessibility.md`](./accessibility.md)
for the contrast audit. Base/Primary→orange, Base/Secondary→violet (brand), Neutrals,
Semantic status colors are all faithful.

## Brand extensions — from the Claude Design workspace (not Figma)

The Claude Design workspace ("AltaVibración Design System",
`claude.ai/design/p/6e43ffb4-24c4-4461-a4aa-81ee1ce59892`) evolved the system beyond
what the Figma Variables define. Those additions were synced back into the
**hand-authored** layer (`semantic.css`, "Brand extensions" section) — NOT into
`tokens.json`/`tokens.css`, which `build-palette.mjs`/`build-tokens.mjs` regenerate
from Figma and would silently drop them:

- extended radii `--radius-2xl` (16px, cards) and `--radius-3xl` (32px, hero photo cards);
- warm shadows `--shadow-card` / `--shadow-pop` (`rgba(51,16,10,…)`);
- brand gradients `--grad-primary` (logo mark) and `--grad-swoosh` (violet→orange);
- `--font-roboto` / `--font-ui` (Roboto-first UI surfaces; files in `brand/fonts/`).

The workspace also defines a semantic type ramp as `.t-*` classes; it is **not
duplicated here** because every entry maps 1:1 onto a utility already generated from
the `--text-*` tokens:

| Workspace class                                   | `@saas/ui` utility                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `.t-h1` / `.t-h2` / `.t-h3`                       | `text-header-h1-bold` / `text-header-h2-semibold` / `text-header-h3-medium`           |
| `.t-title-lg` / `.t-title-md` / `.t-title-sm`     | `text-title-title-large` / `text-title-titel-medium` (sic) / `text-title-title-small` |
| `.t-b0`…`.t-b5` (+`-bold`)                        | `text-body-b0-regular`…`text-body-b5-regular` (+`…-semibold`)                         |
| `.t-lead` / `.t-subtle` / `.t-detail` / `.t-code` | `text-lead` / `text-subtle-medium` / `text-detail` / `text-inline-code`               |

## Components

### Button — pilot, partial parity ✅/⚠️

Aligned to Figma's `Button / States` (Type × State) and `Button / Size` sets:

| Figma                                | → @saas/ui                                    | Notes                                                                                                                                                                           |
| ------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type=Primary                         | `variant="default"`                           | orange-300 fill + orange-900 text (5.42:1); hover lightens. Figma's focus=orange-400 fill is **dropped** (orange-900 on it = 3.77:1 < AA) — focus ring is the indicator instead |
| Type=Secondary                       | `variant="outline"`                           | white surface + neutral-200 border + orange-900 text; border darkens on hover                                                                                                   |
| Type=Tertiary                        | `variant="ghost"`                             | text-only, neutral-100 hover wash                                                                                                                                               |
| Size=Small / Medium / Large          | `size="sm" / "default" / "lg"`                | padding 4×8 / 8×12 / 12×16; **shared** 8px radius, Open Sans SemiBold 18px, 24px icons, 4px gap                                                                                 |
| State=Default/Hover/Focused/Disabled | CSS `:hover` / `:focus-visible` / `:disabled` | Figma disabled = neutral-200 bg + neutral-400 text; we use shadcn's uniform `opacity-50` (divergence)                                                                           |

**Not Figma-backed** (shadcn defaults, no Figma Button Type): `secondary` (neutral fill),
`destructive` (uses the Figma Semantic/Red token), `link` (orange-700, legible). Kept for
API completeness.

**Still not pixel-parity:** VR baselines assert self-consistency, not a Figma overlay
diff. Hover/focus are approximated, not pixel-matched.

> **Source for the audits below (2026-06-04):** the Figma API was rate-limited (429), so these
> were aligned to the **component specimen cards** (`preview/comp-*.html`) from the **Claude Design**
> handoff of the _same_ `UI-Exercise` file — the design tool's faithful reconstruction of the Figma
> controls. All values are bound to **semantic tokens** (the DS stays brand-agnostic / re-themeable);
> AA is preserved over pixel-fidelity where the two conflict.

### Input · Field · Select — audited ✅ (2026-06-04)

Aligned to the form-control specimen (`comp-inputs.html`).

| Figma control (specimen)            | → @saas/ui                             | Notes                                                                                           |
| ----------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Text field — 44px tall, 8px radius  | `Input` `h-11 rounded-lg px-4`         | was `h-9 rounded-md px-3`; now matches the 44 / 8px-radius / 16px-pad spec                      |
| Select / dropdown (field + chevron) | `SelectTrigger` `h-11 rounded-lg px-4` | default size matched to Input; `sm` → `h-9`                                                     |
| Label + control + hint/error        | `Field`                                | wraps `Input`; inherits the above + the a11y wiring (label / aria / required)                   |
| Focus                               | `focus-visible:ring-ring/50`           | **divergence (a11y):** specimen uses orange-400 @16%; we keep the stronger orange-500 @50% ring |
| Resting border                      | `border-input` (neutral-200)           | specimen uses `rgba(39,47,78,.16)`; neutral-200 is slightly higher-contrast — kept              |

### Card — audited ✅ (2026-06-04)

Aligned to `comp-cards.html`.

| Figma card (specimen)         | → @saas/ui           | Notes                                                                                                                                            |
| ----------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 16px radius                   | `Card` `rounded-2xl` | was `rounded-xl` (12px) → now 16px                                                                                                               |
| White fill + soft warm shadow | `bg-card shadow-sm`  | specimen shadow is warm (`0 2px 8px rgba(51,16,10,.08)`); we keep the token-neutral `shadow-sm` so a brand may override. No colored left-border. |

### Badge — audited ✅ / ⚠️ (2026-06-04)

Aligned to `comp-badges.html`.

| Figma badge (specimen)            | → @saas/ui                          | Notes                         |
| --------------------------------- | ----------------------------------- | ----------------------------- |
| Pill (full radius)                | `Badge` `rounded-full px-2.5`       | was `rounded-md` → now a pill |
| Solid primary / neutral / outline | `default` / `secondary` / `outline` | mapping unchanged             |

**⚠️ Status tints deferred (AA).** The specimen also shows soft status badges (`*-light` bg + `*-base`
text for Confirmada / Pendiente / Virtual / Cancelada). Measured against our WCAG AA gate, **3 of 4 fail
as text**: success 3.47:1, warning 3.09:1, error 4.36:1 (only info 4.82:1 passes). Shipping them as-is
would breach the gate, so they're **not** added; they need AA-safe darker status foregrounds (a future
token addition) before becoming `success` / `warning` / `info` variants.

### Checkbox · RadioGroup · Chip — audited ✅ / ⚠️ (2026-07-13)

New primitives ported from the "Selectors & chips" specimen (`comp-selectors.html`), built on the
**selection roles** (`--color-selected` / `--color-selected-foreground` in `semantic.css`).

| Specimen                                        | → @saas/ui                                          | Notes                                                                                                                                                        |
| ----------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Radio / checkbox — 22px, selected orange-400    | `RadioGroupItem` / `Checkbox` `size-[22px]`         | **divergence (a11y):** selected fill steps orange-400 → orange-500 (2.69:1 fails non-text 1.4.11; 3.28:1 passes — the same shift the focus ring makes)       |
| Unselected control — neutral-300                | `border-border-strong`                              | role-addressable (themes re-skin it)                                                                                                                         |
| Time chip — 44px, 8px radius, Open Sans Bold 16 | `Chip` `h-11 rounded-lg text-base font-bold`        | height/radius/type faithful; renders `<button aria-pressed>`                                                                                                 |
| Chip selected — orange-400 fill + white text    | `bg-selected text-selected-foreground`              | **divergence (a11y):** white on orange-400 is 2.69:1; the pair used is orange-500 + orange-950 (4.93:1 AA). Selection stays saturated-orange, text goes dark |
| Icon-based controls (Lucide/Material glyphs)    | real form controls (`radix-ui` Checkbox/RadioGroup) | the specimen draws icons; the DS ships accessible controls with the same geometry                                                                            |

### Avatar · Dialog · Toast · Label — no Figma component specimen

These have **no dedicated component** in the `UI-Exercise` file (none in the specimen set). They stay
**token-faithful shadcn defaults** — correct palette / type / radius, with no pixel target to match —
the same way Button's non-Figma variants (`secondary` / `destructive` / `link`) are handled. Re-audit
if a Figma component for any of them is added later.

## Fonts — wired ✅

Figma uses **Open Sans** (Body) and **Archivo** (Headers/Display). `--font-sans` →
Open Sans (drives the default body font, so primitives inherit it); `--font-display` →
Archivo. The library only _declares_ the families — consumers load the files. The example
app and Storybook self-host them via `@fontsource` (verified: rendered `font-family`
resolves to "Open Sans" in both).

## Spacing — no Figma scale (finding)

The Figma file defines **no named spacing/sizing scale** — gaps/paddings are ad-hoc per
frame (2, 5, 6, 10, 11, 23, 25 px… no discrete ramp). So there's nothing to extract;
`@saas/ui` uses **Tailwind's default 4px-based spacing**. Radius is the exception: anchored
to the Button's 8px corner (`--radius-lg`).

## Dark mode — deferred (no dark source in Figma)

**There is no dark palette in Figma.** An earlier version of this note claimed one existed
at `_Swatch/Light and Dark` — that was an **unverified assumption**, not grounded in any
snapshot. The cached `tokens/figma-all-palettes.yaml` is light-only, and the live
`UI-Exercise` file has no `Dark/*` swatches (confirmed 2026-06-04). So the real blocker was
never the Figma rate limit — the source doesn't exist.

Dark mode is **deferred to a future theming epic** (originally tracked in the
retired `saas-planner` repo). When revisited, first decide the **source** — a
design/product call, not a rate-limit issue:

1. **Add `Dark/*` swatches to Figma** → extract faithfully via `scripts/build-palette.mjs`
   (keeps Figma as the single source of truth); or
2. **Derive a dark palette in code** from the light tokens (systematic neutral/surface/text
   remap, shadcn/Radix-style) with `.dark{}` via `@custom-variant dark` + a real dark
   contrast audit — ships without Figma, but it's a _designed-in-code_ theme (no "faithful
   extract").

The structural work is the same either way (`semantic.css` → `@theme inline` + `.dark{}`,
dark contrast audit, dark stories/VR baselines). The light theme stays as shipped.
