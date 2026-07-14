# Alta Vibración — brand assets

Brand collateral synced **from the Claude Design workspace** ("AltaVibración Design
System", https://claude.ai/design/p/6e43ffb4-24c4-4461-a4aa-81ee1ce59892) into this
repo. These are design sources, not package runtime — nothing here ships in the
`@saas/ui` npm package (see `ui/package.json#files`). The brand-extension _tokens_
that accompany these assets live in `ui/src/semantic.css` ("Brand extensions"
section).

## Inventory

| Path                                                           | What                                                                                   | Provenance                                                                                                                                                                                      |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets/logo-mark.svg`                                         | "AV" monogram, baked-in orange gradient (`--grad-primary`)                             | workspace `assets/`, verbatim                                                                                                                                                                   |
| `assets/logo-horizontal.svg`                                   | Full "Alta Vibración" wordmark lockup + violet→orange swoosh (`--grad-swoosh`)         | workspace `assets/`, verbatim                                                                                                                                                                   |
| `assets/illustration-1.svg`                                    | Line icon extracted from the .fig (renders as a WhatsApp-style glyph — see gaps below) | workspace `assets/`, verbatim                                                                                                                                                                   |
| `assets/illustration-2.svg`                                    | Line icon extracted from the .fig (renders as a TikTok-style glyph — see gaps below)   | workspace `assets/`, verbatim                                                                                                                                                                   |
| `fonts/Roboto-{Light,Regular,Italic,Medium,SemiBold,Bold}.ttf` | Self-hosted brand font for `--font-ui` surfaces (dashboards/docs/tables)               | **official upstream** (fonts.gstatic.com, Roboto v51 static latin subset) — the workspace's own uploads exceed the sync tool's 256 KiB per-file cap, and they are uploads of this same typeface |

## Photography — from the product repo (supersedes the workspace uploads)

The raster photos exceed the design-sync read cap, so they were sourced from the
**real product repo** instead: [`oscar-ospina/alta`](https://github.com/oscar-ospina/alta)
`public/assets/` (2026-07-13). They carry the brand's hand-drawn single-weight
line-art overlays — the art PENDIENTES.md reported as missing:

- `assets/starry-sunset-sky.webp` — starry sky bleeding into warm orange sunset (the hero photo)
- `assets/cosmic-fire-nebula.webp` — night sky over mountains (dark backdrop / "¿Por qué Numerología?" card)
- `assets/fotolili.webp` — consultant portrait on line-art orange (About card + avatar)
- `assets/autoconocimiento.webp` — thematic: woman + butterflies + line-art (Cita "Autoconocimiento y Destino")
- `assets/compatibilidad.webp` — thematic: couple + line-art (relaciones/compatibilidad)

The workspace's own `lili-*.png` / `hero-bg-home.jpg` uploads remain un-copied
(same size cap) — the alta photos are the product's real assets and take precedence.

## Known gaps (from the workspace's PENDIENTES.md)

- **Iconography is substituted.** The Figma specifies **Material Symbols Rounded**;
  the workspace renders icons with **Lucide** (inline SVG) because the Google icon
  webfont doesn't load reliably there. Production code should prefer real Material
  Symbols Rounded. Lucide→Material name map: calendar→event, clock→schedule,
  badge-check→verified, circle-dot→radio (filled), square-check→checkbox,
  sparkles→auto_awesome.
- **Hero line-art — resolved via the alta photos** (they embed the hand-drawn overlays; standalone SVG exports still don’t exist). Original note: **Hero line-art is missing.** The hand-drawn single-weight illustrations
  (botanical/figurative, golden glow) could not be extracted cleanly from the .fig —
  `illustration-1/2.svg` here are NOT that art (they render as social-media glyphs);
  the workspace fell back to the cosmic photo. Blocked on original SVG/PNG exports.
- **Logo wordmark typeface is unidentified.** It's a custom display serif — always
  use the SVG lockups; don't substitute a font.
- **Payment brand logos** (Visa, Mastercard, PSE, Nequi, Amex) referenced by the
  checkout design were never copied into the workspace or here.
