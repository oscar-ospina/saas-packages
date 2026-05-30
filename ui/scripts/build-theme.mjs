#!/usr/bin/env node
// Offline half of the token pipeline: DTCG tokens.json -> Tailwind v4 tokens.css
// (the generated primitive @theme block; the hand-authored src/theme.css entry
// imports it alongside the semantic layer).
//
//   node scripts/build-theme.mjs                 # tokens/tokens.json -> src/tokens.css
//   node scripts/build-theme.mjs --check         # fail (exit 1) if src/tokens.css is stale
//   node scripts/build-theme.mjs <in.json> <out.css>
//
// Runs with no network and no Figma token, so CI can use --check to guard
// against drift between the committed tokens.json and tokens.css.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dtcgToCss } from "./lib/dtcg-to-css.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");

const argv = process.argv.slice(2);
const check = argv.includes("--check");
const positional = argv.filter((a) => !a.startsWith("--"));

const inPath = positional[0] ?? path.join(pkgRoot, "tokens", "tokens.json");
const outPath = positional[1] ?? path.join(pkgRoot, "src", "tokens.css");

const dtcg = JSON.parse(fs.readFileSync(inPath, "utf8"));
const css = dtcgToCss(dtcg);

if (check) {
  const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : "";
  if (current !== css) {
    console.error(
      `✗ ${path.relative(pkgRoot, outPath)} is out of sync with ${path.relative(pkgRoot, inPath)}.\n` +
        `  Run \`npm run build:tokens\` and commit the result.`,
    );
    process.exit(1);
  }
  console.log(`✓ ${path.relative(pkgRoot, outPath)} is in sync with tokens.json`);
} else {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, css);
  console.log(`✓ wrote ${path.relative(pkgRoot, outPath)} from ${path.relative(pkgRoot, inPath)}`);
}
