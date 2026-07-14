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

## Not synced — file-size cap

The design-sync tool caps reads at 256 KiB/file; these workspace files exceed it
and must be copied manually (download from the workspace UI, or re-export from the
original sources):

- `assets/lili-profile.png` — consultant portrait (32px-rounded card)
- `assets/lili-home-1.png`, `assets/lili-home-2.png` — warm natural-light portraits (Home)
- `assets/hero-bg-home.jpg` — cosmic sky photograph (dark hero background)

## Known gaps (from the workspace's PENDIENTES.md)

- **Iconography is substituted.** The Figma specifies **Material Symbols Rounded**;
  the workspace renders icons with **Lucide** (inline SVG) because the Google icon
  webfont doesn't load reliably there. Production code should prefer real Material
  Symbols Rounded. Lucide→Material name map: calendar→event, clock→schedule,
  badge-check→verified, circle-dot→radio (filled), square-check→checkbox,
  sparkles→auto_awesome.
- **Hero line-art is missing.** The hand-drawn single-weight illustrations
  (botanical/figurative, golden glow) could not be extracted cleanly from the .fig —
  `illustration-1/2.svg` here are NOT that art (they render as social-media glyphs);
  the workspace fell back to the cosmic photo. Blocked on original SVG/PNG exports.
- **Logo wordmark typeface is unidentified.** It's a custom display serif — always
  use the SVG lockups; don't substitute a font.
- **Payment brand logos** (Visa, Mastercard, PSE, Nequi, Amex) referenced by the
  checkout design were never copied into the workspace or here.
