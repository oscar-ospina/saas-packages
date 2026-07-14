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

Each primitive in `ui/src/components/` is one `.tsx` (cva variants, `radix-ui`, `cn()` from `lib/cn`) + sibling `.test.tsx` + `.stories.tsx`, re-exported from `src/index.ts`. Known gap: Button reaches raw palette tokens (`text-orange-*`) directly, so role-only themes miss it (saas-planner#27).

## Conventions

- Planning lives in the sibling `saas-planner` repo; commits reference stories: `feat: <summary> (oscar-ospina/saas-planner#<story>)`.
- User-facing `@saas/ui` changes need a changeset (`npx changeset`); internal-only changes (CI, docs) skip it.
- Dark mode is deferred and has **no Figma source** — don't invent a palette; see figma-parity.md for the two sourcing options.
