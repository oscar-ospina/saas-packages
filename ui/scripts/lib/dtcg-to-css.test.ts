import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// @ts-expect-error — plain ESM module, no types needed for the test
import { dtcgToCss } from "./dtcg-to-css.mjs";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const tokens = JSON.parse(fs.readFileSync(path.join(pkgRoot, "tokens", "tokens.json"), "utf8"));
const themeCss = fs.readFileSync(path.join(pkgRoot, "src", "theme.css"), "utf8");

describe("token pipeline (DTCG → Tailwind v4 theme.css)", () => {
  it("regenerates src/theme.css byte-for-byte from tokens.json", () => {
    // Guards against committing a tokens.json change without regenerating the CSS.
    expect(dtcgToCss(tokens)).toBe(themeCss);
  });

  it("maps font.family.* to the --font-* namespace (not --font-family-*)", () => {
    const css = dtcgToCss(tokens);
    expect(css).toMatch(/--font-archivo: "Archivo", "sans-serif";/);
    expect(css).not.toMatch(/--font-family-/);
  });

  it("explodes typography composites into the --text-NAME--PROPERTY family", () => {
    const css = dtcgToCss(tokens);
    expect(css).toMatch(/--text-header-h1-bold: 56px;/);
    expect(css).toMatch(/--text-header-h1-bold--font-family: var\(--font-archivo\);/);
    expect(css).toMatch(/--text-header-h1-bold--font-weight: var\(--font-weight-bold\);/);
  });

  it("emits the @theme block Tailwind v4 expects", () => {
    expect(dtcgToCss(tokens)).toContain("@theme {");
  });
});
