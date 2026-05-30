# Contributing to `packages`

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
```

## The design-token contract

Tokens are **generated from Figma, never hand-edited**. The source of truth is
the Figma file `UI-Exercise` (key `i4WmV5Gfk9uivVQXC5NY8j`). The pipeline (see
[token-pipeline ADR](https://github.com/oscar-ospina/saas-planner/blob/main/docs/superpowers/specs/2026-05-27-ds-tokens-pipeline.md))
has two halves:

| Step                 | Command                                              | Needs Figma token?      | Output                                       |
| -------------------- | ---------------------------------------------------- | ----------------------- | -------------------------------------------- |
| Figma → DTCG + CSS   | `node ui/scripts/build-tokens.mjs <figma-dump.json>` | yes (to fetch the dump) | `ui/tokens/tokens.json` + `ui/src/theme.css` |
| DTCG → CSS (offline) | `npm run build:tokens` (in `ui/`)                    | no                      | `ui/src/theme.css`                           |
| Drift check (CI)     | `npm run check:tokens` (in `ui/`)                    | no                      | exit 1 if `theme.css` is stale               |

`ui/src/theme.css` is a **generated artifact** — edit `tokens.json` (or re-run
the Figma transform), then regenerate. CI fails if they drift.

### Refreshing tokens from Figma

```bash
export FIGMA_API_KEY=...        # a personal access token with file_content:read
export FIGMA_FILE_KEY=i4WmV5Gfk9uivVQXC5NY8j
curl -H "X-Figma-Token: $FIGMA_API_KEY" \
  "https://api.figma.com/v1/files/$FIGMA_FILE_KEY?geometry=paths" -o figma-dump.json
node ui/scripts/build-tokens.mjs figma-dump.json ui
git diff ui/tokens/tokens.json ui/src/theme.css   # review, then commit
```

## Figma style-naming contract

Token quality is bounded by how Figma styles are named. The transformer walks
the file tree, reads values off nodes that apply a style, and names tokens from
the style name. To get clean tokens, name Figma styles like this:

- **`Category/Variant` slash convention.** Each `/` becomes a nesting level and a
  CSS-var segment. `Header/H1 Bold` → `--text-header-h1-bold`; `Slate/500` →
  `--color-slate-500`.
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

- No spacing or border-radius scale yet — `UI-Exercise` uses raw inline pixels,
  not named tokens. Introduce named Figma styles (or wait for inference) before
  expecting `--spacing-*` / `--radius-*`.
- No dark-mode / theme modes yet (deferred per epic #5).

## Commits & releases

- Commit style: `feat: <summary> (oscar-ospina/saas-planner#<story>)`.
- Public, user-facing changes need a changeset: `npx changeset` then commit the
  generated file. Internal-only changes (CI, docs) can skip it.
- `@saas/ui` is versioned with semver via [changesets](https://github.com/changesets/changesets);
  the example app under `examples/` is private and never published.
