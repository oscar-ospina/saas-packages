#!/usr/bin/env node
// Full token pipeline: Figma file dump -> DTCG tokens.json + Tailwind v4 theme.css.
//
//   # 1. Fetch the Figma file (needs FIGMA_API_KEY + the file key)
//   curl -H "X-Figma-Token: $FIGMA_API_KEY" \
//     "https://api.figma.com/v1/files/$FIGMA_FILE_KEY?geometry=paths" -o figma-dump.json
//
//   # 2. Transform
//   node scripts/build-tokens.mjs figma-dump.json .
//
// Writes tokens/tokens.json and src/theme.css under <out-dir> (default: package
// root). This is the half that needs the Figma source; CI uses build-theme.mjs
// (offline) to regenerate just theme.css from the committed tokens.json.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { figmaToDtcg } from "./lib/figma-to-dtcg.mjs";
import { dtcgToCss } from "./lib/dtcg-to-css.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");

const [, , inPath, outDir = pkgRoot] = process.argv;
if (!inPath) {
  console.error("usage: node scripts/build-tokens.mjs <figma-dump.json> [out-dir]");
  process.exit(1);
}

const file = JSON.parse(fs.readFileSync(inPath, "utf8"));
const { dtcg, stats } = figmaToDtcg(file);

const tokensPath = path.join(outDir, "tokens", "tokens.json");
const themePath = path.join(outDir, "src", "theme.css");

fs.mkdirSync(path.dirname(tokensPath), { recursive: true });
fs.mkdirSync(path.dirname(themePath), { recursive: true });

const tokensJson = {
  $description: `Generated from Figma file "${stats.source}". Custom transformer (spike #7).`,
  ...dtcg,
};
fs.writeFileSync(tokensPath, JSON.stringify(tokensJson, null, 2) + "\n");
fs.writeFileSync(themePath, dtcgToCss(dtcg));

console.log(JSON.stringify(stats, null, 2));
console.log(
  `\n✓ wrote ${path.relative(pkgRoot, tokensPath)} and ${path.relative(pkgRoot, themePath)}`,
);
