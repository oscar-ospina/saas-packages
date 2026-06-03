# Contributing to `saas-packages`

This monorepo holds the shared design system for the SaaS product. The first
package is [`@saas/ui`](./ui) (`ui/`). Planning, epics, and stories live in the
sibling [`saas-planner`](https://github.com/oscar-ospina/saas-planner) repo —
reference the relevant story number in commits and PRs.

## Prerequisites

- Node `22` (`.nvmrc`)
- npm `10+` (the repo uses **npm workspaces**, not pnpm/yarn)

```bash
npm install          # installs every workspace
npm run build        # builds @saas/ui
npm run lint         # ESLint (flat config)
npm test             # Vitest

# See it running
npm run storybook --workspace=@saas/ui            # whole DS → http://localhost:6006
npm run dev --workspace=@saas/example-playground  # example consumer app (Vite, :5173)
```

Deployed Storybook: <https://oscar-ospina.github.io/saas-packages/>.

## The design-token contract

Tokens are **generated from Figma, never hand-edited**. The source is the Figma
file `UI-Exercise` (key `i4WmV5Gfk9uivVQXC5NY8j`), read via the Framelink MCP.
Color and typography come from two different places in the file:

| Half                 | Command                                              | Source in Figma                                                         | Output                                                    |
| -------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| **Color**            | `node ui/scripts/build-palette.mjs`                  | the "All palettes" frame (snapshot `ui/tokens/figma-all-palettes.yaml`) | rewrites the `color` tree of `tokens.json` + `tokens.css` |
| **Typography**       | `node ui/scripts/build-tokens.mjs <figma-dump.json>` | applied text styles (`/v1/files` styles-walk)                           | `tokens.json` + `tokens.css`                              |
| DTCG → CSS (offline) | `npm run build:tokens` (in `ui/`)                    | —                                                                       | `ui/src/tokens.css`                                       |
| Drift check (CI)     | `npm run check:tokens` (in `ui/`)                    | —                                                                       | exit 1 if `tokens.css` is stale                           |

> **Why two paths:** the brand palette lives in the "All palettes" documentation
> frame as raw swatches, not applied styles, so the styles-walk never saw it (it
> emitted an unrelated slate/M3 set). The Figma Variables registry isn't readable
> via the MCP (`boundVariables=0`), so the frame is the accessible source.
> `build-palette.mjs` asserts the frame's section structure and fails loudly if it
> drifts. (See the [token-pipeline ADR](https://github.com/oscar-ospina/saas-planner/blob/main/docs/superpowers/specs/2026-05-27-ds-tokens-pipeline.md).)

The token stylesheet is split into three files:

- **`ui/src/tokens.css`** — generated Figma primitives (`--color-neutral-*`,
  `--color-orange-*`, `--color-violet-*`, `--color-semantic-*`, `--text-*`,
  `--font-*`). **Do not edit by hand.**
- **`ui/src/semantic.css`** — the semantic layer (`--color-primary`,
  `--color-border`, `--radius-*`, `--font-sans`) mapping shadcn roles to those
  Figma tokens. Edit here to change a role mapping; keep it contrast-audited. See
  [`ui/docs/figma-parity.md`](./ui/docs/figma-parity.md) +
  [`ui/docs/accessibility.md`](./ui/docs/accessibility.md).
- **`ui/src/theme.css`** — the entry consumers import; it `@import`s
  `tw-animate-css` + `tokens.css` + `semantic.css`.

### Refreshing tokens from Figma

**Color** (the brand palette):

1. Re-pull the "All palettes" frame via the Figma MCP (`get_figma_data`, node
   `1:692`) and save it over `ui/tokens/figma-all-palettes.yaml`.
2. `node ui/scripts/build-palette.mjs` — rewrites the color tokens + `tokens.css`.
3. Review `git diff`; if values changed, re-run the contrast audit
   (`ui/docs/accessibility.md`) and regenerate VR baselines, then commit.

**Typography** (needs a Figma API token for the `/v1/files` styles-walk):

```bash
export FIGMA_API_KEY=...        # personal access token, file_content:read
curl -H "X-Figma-Token: $FIGMA_API_KEY" \
  "https://api.figma.com/v1/files/i4WmV5Gfk9uivVQXC5NY8j?geometry=paths" -o figma-dump.json
node ui/scripts/build-tokens.mjs figma-dump.json ui
```

## Figma style-naming contract

This governs the **typography** half (the styles-walk) — color is parsed
structurally from the "All palettes" frame, so it doesn't depend on style names.
Type token quality is bounded by how Figma text styles are named: the transformer
walks the tree, reads values off nodes that apply a style, and names tokens from
the style name. To get clean tokens, name Figma styles like this:

- **`Category/Variant` slash convention.** Each `/` becomes a nesting level and a
  CSS-var segment. `Header/H1 Bold` → `--text-header-h1-bold`; `Body/B1 Regular` →
  `--text-body-b1-regular`.
- **Keep casing/words human.** Spaces and casing are slugified
  (`H1 Bold` → `h1-bold`), so `Body/B1 Regular` is fine.
- **Never name a style after its value.** A style literally named `0f172a`
  produces the low-information token `--color-0f172a`. Name it `Slate/900`.
- **A style must be _applied_ on at least one node** to be exported — Figma has
  no API to read an unused local style's value. Drop styles that aren't used, or
  apply them somewhere intentional.
- **Use consistent family/scale names** across colors so semantic grouping
  survives (`Light/Grayscale/200`, not ad-hoc one-offs).

### Known gaps (tracked, not bugs)

- **No spacing scale in Figma** — gaps/paddings are ad-hoc (no named ramp), so
  `@saas/ui` uses Tailwind's default 4px spacing. Radius is anchored to the
  Button's 8px corner (`--radius-lg`). See [`ui/docs/figma-parity.md`](./ui/docs/figma-parity.md).
- **Dark mode** not implemented yet (next): a dark palette exists in Figma's
  `_Swatch/Light and Dark`; it needs the `@theme inline` + `.dark{}` restructure,
  a faithful dark-palette extraction, and a dark-surface contrast audit.
- **Component parity:** only the Button is aligned to its Figma component matrix
  (Type×State×Size); the other primitives inherit the correct tokens but aren't
  pixel-aligned to their Figma components yet.

## Commits & releases

- Commit style: `feat: <summary> (oscar-ospina/saas-planner#<story>)`.
- Public, user-facing changes need a changeset: `npx changeset` then commit the
  generated file. Internal-only changes (CI, docs) can skip it.
- `@saas/ui` is versioned with semver via [changesets](https://github.com/changesets/changesets);
  the example app under `examples/` is private and never published.
