#!/usr/bin/env node
// Rebuild the COLOR half of the token set from the Figma "All palettes" frame.
//
//   node scripts/build-palette.mjs
//
// Reads tokens/figma-all-palettes.yaml (a committed get_figma_data snapshot of
// the foundations frame), parses it into DTCG color tokens, and rewrites
// tokens/tokens.json — replacing the `color` tree while KEEPING the typography
// (`font`, `text`) and `shadow` trees that figma-to-dtcg already extracts
// correctly from applied text styles. Then regenerates src/tokens.css.
//
// Refresh the snapshot when the Figma palette changes:
//   (re-run get_figma_data on the "All palettes" node, save over the .yaml)
//
// See lib/figma-palette-frame.mjs for why color comes from the frame, not the
// styles-walk.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parsePaletteFrame } from "./lib/figma-palette-frame.mjs";
import { dtcgToCss } from "./lib/dtcg-to-css.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const snapshotPath = path.join(pkgRoot, "tokens", "figma-all-palettes.yaml");
const tokensPath = path.join(pkgRoot, "tokens", "tokens.json");
const cssPath = path.join(pkgRoot, "src", "tokens.css");

const { color, stats } = parsePaletteFrame(fs.readFileSync(snapshotPath, "utf8"));
const existing = JSON.parse(fs.readFileSync(tokensPath, "utf8"));

const tokens = {
  $description: `Color from Figma "UI Exercise" → All palettes frame; typography from applied text styles. Custom transformer (spike #7).`,
  color,
  font: existing.font,
  text: existing.text,
  shadow: existing.shadow,
};

fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2) + "\n");
fs.writeFileSync(
  cssPath,
  dtcgToCss({ color, font: existing.font, text: existing.text, shadow: existing.shadow }),
);

console.log(JSON.stringify(stats, null, 2));
console.log(
  `\n✓ rewrote ${path.relative(pkgRoot, tokensPath)} (color) and ${path.relative(pkgRoot, cssPath)}`,
);
