# @saas/ui

Design-system component library for the SaaS product. Tailwind CSS v4 + Radix UI
primitives, built on shadcn/ui component sources, with design tokens generated
from Figma.

- **ESM-only.** Ships TSX/JS source + type declarations with literal Tailwind
  class strings preserved — the consumer's Tailwind build compiles them. No
  precompiled component CSS.
- **Tokens are generated**, not hand-written — see [token pipeline](#design-tokens).

## Install

```bash
npm install @saas/ui
npm install -D tailwindcss@^4   # peer; plus your bundler's Tailwind integration
```

`@saas/ui` declares peers `tailwindcss@^4`, `react@^18 || ^19`,
`react-dom@^18 || ^19` — the consumer owns the single Tailwind build.

## Wire it up

In your app's global stylesheet:

```css
@import "tailwindcss"; /* you import the framework — exactly once */
@import "@saas/ui/theme.css"; /* design tokens → CSS vars + utilities */
@source "../node_modules/@saas/ui"; /* let Tailwind scan the lib's class strings */
```

The `@source` line is **mandatory**: Tailwind v4 ignores `node_modules` during
content detection, so without it every `@saas/ui` utility is purged. Narrow it
to `"../node_modules/@saas/ui/dist/**/*.mjs"` to keep scans fast. Do **not** add
`@import "tailwindcss"` anywhere in `@saas/ui` — only the consumer imports it.

```tsx
import { cn } from "@saas/ui";
// Components (Button, Input, …) are re-exported from "@saas/ui" as they land.
```

## Compatibility matrix

| `@saas/ui` | tailwindcss         | react          | Notes                                                                                                                      |
| ---------- | ------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `0.x`      | `^4.0` (tested 4.3) | `^18 \|\| ^19` | Tailwind **v4 only** — the `@source` directive does not exist in v3. Keep the lib and consumer on the same Tailwind major. |

Version skew between the lib's Tailwind and the consumer's is the most common
failure mode (v4 classes get purged/misread under v3). Pin `tailwindcss@^4`.

## Design tokens

Tokens are generated from the Figma file `UI-Exercise` and committed as:

- `tokens/tokens.json` — W3C DTCG source of truth (also exported as
  `@saas/ui/tokens.json` for non-CSS / cross-platform consumers).
- `src/theme.css` — generated Tailwind v4 `@theme` block (the `./theme.css`
  export). **Do not edit by hand.**

```bash
npm run build:tokens   # regenerate theme.css from tokens.json
npm run check:tokens   # CI: fail if theme.css drifted from tokens.json
```

To refresh from Figma, see the repo [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Scripts

| Script                                  | What                             |
| --------------------------------------- | -------------------------------- |
| `npm run build`                         | tsdown → `dist/` (ESM + `.d.ts`) |
| `npm run dev`                           | tsdown watch                     |
| `npm test`                              | Vitest (jsdom)                   |
| `npm run typecheck`                     | `tsc --noEmit`                   |
| `npm run build:tokens` / `check:tokens` | token pipeline / drift check     |
