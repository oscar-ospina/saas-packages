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

### Other primitives — NOT yet audited against Figma

Badge, Card, Input, Label, Field, Avatar, Select, Dialog, Toast inherit the parity-correct
**tokens** but haven't been aligned to specific Figma components. Open work.

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

Dark mode is **deferred to a future theming epic** (tracked in
[saas-planner #13](https://github.com/oscar-ospina/saas-planner/issues/13), unlinked from
epic #5). When revisited, first decide the **source** — a design/product call, not a
rate-limit issue:

1. **Add `Dark/*` swatches to Figma** → extract faithfully via `scripts/build-palette.mjs`
   (keeps Figma as the single source of truth); or
2. **Derive a dark palette in code** from the light tokens (systematic neutral/surface/text
   remap, shadcn/Radix-style) with `.dark{}` via `@custom-variant dark` + a real dark
   contrast audit — ships without Figma, but it's a *designed-in-code* theme (no "faithful
   extract").

The structural work is the same either way (`semantic.css` → `@theme inline` + `.dark{}`,
dark contrast audit, dark stories/VR baselines). The light theme stays as shipped.
