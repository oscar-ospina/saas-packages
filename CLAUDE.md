# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Node 22 (`.nvmrc`), **npm workspaces** (not pnpm/yarn).

```bash
npm install                # all workspaces
npm run build              # tsdown → ui/dist
npm run lint               # ESLint flat config; format with `npm run format`
npm run typecheck          # tsc --noEmit per workspace
npm test                   # Vitest per workspace
npm run check:tokens       # fail if ui/src/tokens.css drifted from tokens.json

# Single test (from ui/)
npx vitest run src/components/button.test.tsx

# Storybook / example app
npm run storybook --workspace=@saas/ui            # :6006
npm run dev --workspace=@saas/example-playground  # Vite :5173

# Visual regression (Playwright) — build the static Storybook FIRST
npm run build-storybook --workspace=@saas/ui
npm run test:visual --workspace=@saas/ui          # `:update` refreshes baselines
```

VR baselines are Linux-generated; regenerate only in an environment matching CI (official Playwright container). CI = check:tokens + lint + build + typecheck + test (`ci.yml`) and VR + e2e (`visual.yml`); PRs are squash-merged.

## Architecture

One publishable package: `ui/` → `@saas/ui` (Tailwind v4 + Radix + shadcn-style sources). `examples/*` are private consumers; `brand/` holds Alta Vibración assets/fonts (design sources, never shipped in the npm package).

### Token pipeline — the write rules that matter

Three CSS layers compose `ui/src/theme.css` (the consumer entry):

1. `ui/src/tokens.css` — **generated, never hand-edit.** Built from `ui/tokens/tokens.json` (DTCG) via `npm run build:tokens`; `tokens.json` itself is regenerated from Figma (`ui/scripts/build-palette.mjs` rewrites the color tree, `build-tokens.mjs` the typography). Hand additions to either file get silently dropped on the next regen.
2. `ui/src/semantic.css` — **hand-authored.** shadcn role mapping (`--color-primary`, `--radius-*`, `--font-sans`) plus the "Brand extensions" section: any token that is NOT a Figma Variable (radii 2xl/3xl, brand shadows/gradients, `--font-ui`) lives here — including everything synced from the Claude Design workspace.
3. `theme.css` imports `tw-animate-css` + both. Consumers import `tailwindcss` themselves (never add it to theme.css — duplicated preflight).

Role mappings are contrast-audited (`ui/docs/accessibility.md`); AA wins over pixel-fidelity when they conflict. Component↔Figma audit state lives in `ui/docs/figma-parity.md`.

### Design-side twin

The Claude Design workspace **"AltaVibración Design System"** (claude.ai/design project `6e43ffb4-24c4-4461-a4aa-81ee1ce59892`) mirrors this repo and evolves the brand design-side. Syncs run **design → code**: new design-authored tokens land in `semantic.css`, assets in `brand/`. The DesignSync read tool caps files at 256 KiB — the raster photos listed in `brand/README.md` are still pending manual copy.

### Components

Each primitive in `ui/src/components/` is one `.tsx` (cva variants, `radix-ui`, `cn()` from `lib/cn`) + sibling `.test.tsx` + `.stories.tsx`, re-exported from `src/index.ts`. Known gap: Button reaches raw palette tokens (`text-orange-*`) directly, so role-only themes miss it.

## Workflow

Every change: branch from `main` → PR → squash merge. Before pushing, run what CI runs: `check:tokens`, lint, build, typecheck, test — plus VR (`test:visual`) when anything visual moved. Then, by change type:

- **Tokens**: never edit `tokens.css`/`tokens.json` by hand — regenerate (CONTRIBUTING.md "Refreshing tokens from Figma") or add to `semantic.css` per the write rules above. If values changed: contrast audit (`ui/docs/accessibility.md`) + VR baselines.
- **Components**: source + `.test.tsx` + `.stories.tsx` together; intentional visual changes need `test:visual:update` (Linux/Playwright container only) and a `figma-parity.md` entry if the change touches audited parity.
- **Design sync** (workspace → code): fetch via DesignSync in the **main session** — the tool is session-scoped and invisible to subagents. Tokens → `semantic.css`; assets → `brand/`; document gaps in `brand/README.md`.
- **Release**: user-facing `@saas/ui` changes need a changeset (`npx changeset`); internal-only (CI, docs) skip it.
- **DOCs**: always update the documentation before finishing the work.

### When to use subagents

This repo is small (~10 components) — read files directly by default; a subagent that re-discovers the token pipeline wastes more than it saves.

- **Use subagents for**: parallel per-component sweeps (audits/migrations across all primitives at once); digesting bulky output you only need conclusions from (Playwright/Storybook build logs, VR diff triage); web research. Give each agent the write rules above verbatim — they can't see this file's context otherwise.
- **Never delegate to subagents**: DesignSync calls (session-scoped tool — fetches fail there), edits to generated files, or VR baseline updates (environment-sensitive).
- **Background, not subagent**: long single commands (Storybook build, Playwright runs) — run them in background shell mode instead.

## Conventions

- Commits: conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`), imperative summary; scope like `feat(ui):` when it helps.
