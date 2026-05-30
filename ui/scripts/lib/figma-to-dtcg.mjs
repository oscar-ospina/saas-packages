// Figma file tree (`/v1/files/:key` response) -> W3C DTCG token tree.
//
// Walks the document, collects nodes that reference a local style
// (fill / text / effect), reads the concrete values off those nodes, and
// names them from `file.styles`. See token-pipeline ADR 2026-05-27 for the
// rationale (Figma exposes no "list local styles with values" endpoint, so we
// must observe values on applying nodes).

const rgbToHex = ({ r, g, b, a = 1 }) => {
  const ch = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  const hex = `#${ch(r)}${ch(g)}${ch(b)}`;
  return a < 1 ? `${hex}${ch(a)}` : hex;
};

const normalizeWeight = (w) => Math.round(w / 100) * 100;
const WEIGHT_NAMES = {
  100: "thin",
  200: "extralight",
  300: "light",
  400: "regular",
  500: "medium",
  600: "semibold",
  700: "bold",
  800: "extrabold",
  900: "black",
};
const weightName = (w) => WEIGHT_NAMES[normalizeWeight(w)] || String(normalizeWeight(w));

const slug = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/^-+|-+$/g, "");
const splitName = (name) => name.split("/").map(slug).filter(Boolean);
const round2 = (n) => Math.round(n * 100) / 100;

const setDeep = (obj, parts, value) => {
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] ||= {};
    cur = cur[parts[i]];
  }
  cur[parts.at(-1)] = value;
};

/**
 * @param {object} file  parsed Figma `/v1/files/:key` response
 * @returns {{ dtcg: object, stats: object }}
 */
export function figmaToDtcg(file) {
  const styleDefs = file.styles || {};
  const observed = new Map();

  const walk = (node) => {
    if (!node) return;
    const ref = node.styles || {};
    if (ref.fill && node.fills?.length) {
      const f = node.fills.find((p) => p.type === "SOLID") || node.fills[0];
      if (!observed.has(ref.fill)) observed.set(ref.fill, { kind: "fill", paint: f });
    }
    if (ref.text && node.style) {
      if (!observed.has(ref.text)) observed.set(ref.text, { kind: "text", style: node.style });
    }
    if (ref.effect && node.effects?.length) {
      if (!observed.has(ref.effect))
        observed.set(ref.effect, { kind: "effect", effects: node.effects });
    }
    if (Array.isArray(node.children)) for (const child of node.children) walk(child);
  };
  walk(file.document);

  const dtcg = { color: {}, font: { family: {}, weight: {} }, text: {}, shadow: {} };
  const fams = new Set();
  const wts = new Set();
  let applied = 0;

  for (const [id, def] of Object.entries(styleDefs)) {
    const seen = observed.get(id);
    if (!seen) continue;
    applied++;
    const parts = splitName(def.name);
    const desc = def.name;

    if (def.styleType === "FILL" && seen.paint?.type === "SOLID") {
      setDeep(dtcg.color, parts, {
        $type: "color",
        $value: rgbToHex(seen.paint.color),
        $description: desc,
      });
    } else if (def.styleType === "TEXT") {
      const st = seen.style;
      fams.add(st.fontFamily);
      wts.add(st.fontWeight);
      setDeep(dtcg.text, parts, {
        $type: "typography",
        $value: {
          fontFamily: `{font.family.${slug(st.fontFamily)}}`,
          fontSize: `${st.fontSize}px`,
          fontWeight: `{font.weight.${weightName(st.fontWeight)}}`,
          lineHeight:
            st.lineHeightUnit === "PERCENT"
              ? `${round2(st.lineHeightPercent / 100)}`
              : st.lineHeightPx
                ? `${round2(st.lineHeightPx)}px`
                : "1.2",
          letterSpacing: st.letterSpacing ? `${round2(st.letterSpacing)}px` : "normal",
        },
        $description: desc,
      });
    } else if (def.styleType === "EFFECT") {
      const shadows = seen.effects
        .filter((e) => e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW")
        .map((e) => ({
          color: rgbToHex(e.color),
          offsetX: `${e.offset.x}px`,
          offsetY: `${e.offset.y}px`,
          blur: `${e.radius}px`,
          spread: e.spread ? `${e.spread}px` : "0px",
          inset: e.type === "INNER_SHADOW",
        }));
      if (shadows.length) {
        setDeep(dtcg.shadow, parts, {
          $type: "shadow",
          $value: shadows.length === 1 ? shadows[0] : shadows,
          $description: desc,
        });
      }
    }
  }

  for (const f of fams)
    dtcg.font.family[slug(f)] = { $type: "fontFamily", $value: [f, "sans-serif"] };
  for (const w of new Set([...wts].map(normalizeWeight))) {
    dtcg.font.weight[weightName(w)] = { $type: "fontWeight", $value: w };
  }

  const countLeaves = (obj, type) => {
    let n = 0;
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith("$")) continue;
      if (v?.$type === type) n++;
      else if (v && typeof v === "object") n += countLeaves(v, type);
    }
    return n;
  };

  const stats = {
    source: file.name,
    styles_defined: Object.keys(styleDefs).length,
    styles_applied_in_tree: applied,
    emitted: {
      colors: countLeaves(dtcg.color, "color"),
      typography: countLeaves(dtcg.text, "typography"),
      shadows: countLeaves(dtcg.shadow, "shadow"),
      font_families: Object.keys(dtcg.font.family).length,
      font_weights: Object.keys(dtcg.font.weight).length,
    },
  };

  return { dtcg, stats };
}

export { rgbToHex, normalizeWeight, weightName, slug, splitName };
