# saas-packages

Monorepo for the SaaS product's shared, code-shipped packages. A polyrepo
sibling of [`saas-planner`](https://github.com/oscar-ospina/saas-planner)
(planning) and the future product repos (`web`, `api`, …).

| Workspace     | Package            | Description                                                                                          |
| ------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| [`ui/`](./ui) | [`@saas/ui`](./ui) | Design-system component library — Tailwind v4 + Radix + shadcn sources, with Figma-generated tokens. |
| `examples/*`  | _(private)_        | Example consumer apps that import `@saas/ui` end to end.                                             |

Implements [epic #5 — Establish the design system foundation](https://github.com/oscar-ospina/saas-planner/issues/5)
and its two ADRs ([stack](https://github.com/oscar-ospina/saas-planner/blob/main/docs/superpowers/specs/2026-05-27-ds-stack-decision.md),
[token pipeline](https://github.com/oscar-ospina/saas-planner/blob/main/docs/superpowers/specs/2026-05-27-ds-tokens-pipeline.md)).

## Quick start

```bash
nvm use            # Node 22 (.nvmrc)
npm install        # installs every workspace (npm workspaces — not pnpm/yarn)

npm run build      # build all publishable packages
npm run lint       # ESLint (flat config)
npm run typecheck  # tsc --noEmit per workspace
npm test           # Vitest per workspace
npm run check:tokens   # assert theme.css is in sync with tokens.json
```

## See it running

```bash
# Storybook — the whole design system (all primitives, variants, tokens, a11y)
npm run storybook --workspace=@saas/ui            # → http://localhost:6006

# Example consumer app — @saas/ui used end to end ("Team settings" screen)
npm run dev --workspace=@saas/example-playground  # → Vite prints the URL (default :5173)

# Visual regression (Playwright): build the static Storybook first, then compare
npm run build-storybook --workspace=@saas/ui
npm run test:visual --workspace=@saas/ui          # add :update to refresh baselines
```

Or browse the deployed Storybook (auto-published on every push to `main`):
**<https://oscar-ospina.github.io/saas-packages/>**.

## Layout

```
saas-packages/
├── ui/                 # @saas/ui — the design system
│   ├── src/            #   components + generated theme.css
│   ├── tokens/         #   DTCG tokens.json (Figma-generated source of truth)
│   └── scripts/        #   token pipeline (Figma → DTCG → Tailwind v4 theme.css)
├── examples/           # private example consumer apps
├── .changeset/         # semver + changelog (changesets)
└── .github/workflows/  # CI + release
```

## Conventions

- **Package manager:** npm 10 workspaces. Internal deps use `"@saas/ui": "*"`
  (the pnpm/yarn `workspace:*` protocol is not supported by npm).
- **Releases:** [changesets](https://github.com/changesets/changesets), semver,
  per-package `CHANGELOG.md`. Add one with `npx changeset`.
- **Commits:** `feat: <summary> (oscar-ospina/saas-planner#<story>)`.
- See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the design-token workflow and
  the Figma style-naming contract.
