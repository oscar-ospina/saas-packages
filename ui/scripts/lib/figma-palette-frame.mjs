// Parse the Figma "All palettes" foundations frame (a get_figma_data dump) into
// DTCG color tokens.
//
// WHY this exists separately from figma-to-dtcg.mjs:
//   figma-to-dtcg walks the file for *applied local styles*. The brand palette
//   (Neutrals / Orange / Violet ramps, Semantic status colors) lives in the
//   "All palettes" documentation frame as raw swatch fills, NOT as applied
//   styles — so the styles-walk never saw it (it emitted an unrelated slate/M3
//   set instead). This frame is the best *accessible* source of truth: the
//   Figma Variables registry can't be read through the Framelink MCP
//   (boundVariables = 0 in the dump), so we parse the documented swatches.
//
// The input is brittle by nature (a layout frame, not a token API), so this
// asserts the expected section structure and throws loudly if the frame drifts.
// When it throws: re-pull `get_figma_data` for the "All palettes" node and
// refresh tokens/figma-all-palettes.yaml.

// All section titles in the frame (used to track which section a swatch falls
// under). We only emit tokens for SECTIONS; the rest (Gradient, Effects) are
// listed so a swatch never bleeds across a title we ignore.
const TITLES = [
  "Base",
  "Base / Text",
  "Neutrals",
  "Surfaces",
  "Orange",
  "Violet",
  "Gradient",
  "Effects",
  "Semantic",
];
const SECTIONS = ["Base", "Base / Text", "Neutrals", "Surfaces", "Orange", "Violet", "Semantic"];
const RAMP_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

const norm = (v) => (v.startsWith("#") ? v.toLowerCase() : v.trim());

/** Build a `fill_XXX -> value` map from the dump's globalVars.styles block. */
function fillMap(yaml) {
  const m = {};
  const re = /(fill_\w+):\n\s+- '?([^'\n]+)'?/g;
  let x;
  while ((x = re.exec(yaml))) m[x[1]] = x[2];
  return m;
}

/** Ordered [{section, label, value}] for every Color Card, grouped under its section title. */
function readSwatches(yaml) {
  const fills = fillMap(yaml);
  const lines = yaml.split("\n");
  const cardLines = [];
  lines.forEach((ln, i) => {
    if (/^\s*name: Color Card$/.test(ln)) cardLines.push(i);
  });

  let section = null;
  const out = [];
  let nextCard = 0;
  for (let i = 0; i < lines.length; i++) {
    const nm = lines[i].match(/^\s*name: (.+)$/);
    if (nm && TITLES.includes(nm[1]) && /type: TEXT/.test(lines.slice(i, i + 4).join("\n"))) {
      section = nm[1];
    }
    if (cardLines[nextCard] === i) {
      const end = cardLines[nextCard + 1] ?? Math.min(i + 30, lines.length);
      const chunk = lines.slice(i, end).join("\n");
      const fm = chunk.match(/name: Color Sample[\s\S]*?fills: (fill_\w+)/);
      // The card's own label is the FIRST `text:` in its chunk. For the last
      // card in a section the window bleeds into the next section title's
      // `text:`, so never take the last match.
      const label = chunk.match(/text: (.+)/)?.[1].trim();
      const value = fm ? fills[fm[1]] : undefined;
      out.push({ section, label, value });
      nextCard++;
    }
  }
  return out;
}

const setLeaf = (tree, parts, value, desc) => {
  let cur = tree;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]] ||= {};
  cur[parts.at(-1)] = { $type: "color", $value: norm(value), $description: desc };
};

/**
 * @param {string} yaml  contents of tokens/figma-all-palettes.yaml
 * @returns {{ color: object, stats: object }}
 */
export function parsePaletteFrame(yaml) {
  const swatches = readSwatches(yaml);
  const bySec = {};
  for (const s of swatches) (bySec[s.section] ||= []).push(s);

  for (const sec of SECTIONS) {
    if (!bySec[sec]?.length)
      throw new Error(
        `palette-frame: section "${sec}" missing — frame drifted; refresh figma-all-palettes.yaml`,
      );
  }

  const color = {};
  const assertLen = (sec, n) => {
    if (bySec[sec].length !== n)
      throw new Error(
        `palette-frame: section "${sec}" has ${bySec[sec].length} swatches, expected ${n} — frame drifted`,
      );
  };

  // Base: high-level roles the designer declared.
  assertLen("Base", 4);
  for (const { label, value } of bySec["Base"]) {
    setLeaf(color, ["base", label.toLowerCase()], value, `All palettes/Base/${label}`);
  }

  // Base / Text: text hierarchy (Secondary/Tertiary are intentional opacity steps — keep rgba).
  for (const { label, value } of bySec["Base / Text"]) {
    const key = label.toLowerCase().replace(/\./g, "-");
    setLeaf(color, ["text", key], value, `All palettes/Base Text/${label}`);
  }

  // Neutrals ramp: leading #ffffff (a duplicate '50' label) then 50..950.
  assertLen("Neutrals", 12);
  const neutralFirst = norm(bySec["Neutrals"][0].value);
  if (neutralFirst !== "#ffffff")
    throw new Error(`palette-frame: Neutrals[0] expected #ffffff, got ${neutralFirst}`);
  bySec["Neutrals"].slice(1).forEach(({ value }, i) => {
    setLeaf(color, ["neutral", RAMP_STEPS[i]], value, `All palettes/Neutrals/${RAMP_STEPS[i]}`);
  });

  // Brand ramps: Orange = primary, Violet = secondary. Map by position to 50..950.
  for (const [sec, name] of [
    ["Orange", "orange"],
    ["Violet", "violet"],
  ]) {
    assertLen(sec, 11);
    bySec[sec].forEach(({ value }, i) => {
      setLeaf(color, [name, RAMP_STEPS[i]], value, `All palettes/${sec}/${RAMP_STEPS[i]}`);
    });
  }

  // Surfaces: elevation overlays (rgba — kept verbatim).
  for (const { label, value } of bySec["Surfaces"]) {
    const key = label.replace(/^Surface\s*/i, "").toLowerCase() || "base";
    setLeaf(color, ["surface", key], value, `All palettes/Surfaces/${label}`);
  }

  // Semantic status colors: "Light X" -> x.light, "X" -> x.base.
  for (const { label, value } of bySec["Semantic"]) {
    const light = /^light/i.test(label);
    const hue = label.replace(/^light\s*/i, "").toLowerCase();
    setLeaf(
      color,
      ["semantic", hue, light ? "light" : "base"],
      value,
      `All palettes/Semantic/${label}`,
    );
  }

  const countLeaves = (o) =>
    Object.values(o).reduce(
      (n, v) => n + (v?.$type === "color" ? 1 : typeof v === "object" ? countLeaves(v) : 0),
      0,
    );
  return {
    color,
    stats: {
      source: "All palettes frame",
      emitted_colors: countLeaves(color),
      sections: SECTIONS.length,
    },
  };
}
