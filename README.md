# saas-packages

Monorepo for the SaaS product's shared, code-shipped packages — a polyrepo
sibling of the future product repos (`web`, `api`, …). Planning happens in this
repo's issues and PRs.

| Workspace     | Package            | Description                                                                                          |
| ------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| [`ui/`](./ui) | [`@saas/ui`](./ui) | Design-system component library — Tailwind v4 + Radix + shadcn sources, with Figma-generated tokens. |
| `examples/*`  | _(private)_        | Example consumer apps that import `@saas/ui` end to end.                                             |

Implements the "Establish the design system foundation" epic (**complete —
2026-06-04**) and its two ADRs (DS stack, 2026-05-27; token pipeline,
2026-05-27 — authored in the retired `saas-planner` repo).
`@saas/ui` is **published to npm** ([`@saas/ui`](https://www.npmjs.com/package/@saas/ui)) — consumers just `npm i @saas/ui`.

The design system is **brand-agnostic / re-themeable**, modeled on the reference brand **Alta Vibración** (not baked in). Source of truth is the `UI-Exercise` Figma file; the highest-leverage reference is a **Claude Design** handoff bundle (token CSS, component specimen cards, clickable UI kits) — the component↔Figma parity ([`ui/docs/figma-parity.md`](./ui/docs/figma-parity.md)) was audited from it. The live workspace and sync direction are documented in [`CLAUDE.md`](./CLAUDE.md) ("Design-side twin") and [`brand/README.md`](./brand/README.md).

**Re-theming is proven.** Storybook's `Foundations/Theming` story applies an invented _second_ brand purely through **semantic-role overrides** under a `.theme-*` scope — no component or token edits ([PR #7](https://github.com/oscar-ospina/saas-packages/pull/7)). It confirmed the DS re-skins cleanly, and surfaced the one gap: **Button** reaches raw palette tokens (`text-orange-*`) directly, so a role-only theme leaves it warm — a tracked follow-up.

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
├── brand/              # Alta Vibración brand assets + fonts, synced from the
│                       #   Claude Design workspace (see brand/README.md)
├── .changeset/         # semver + changelog (changesets)
└── .github/workflows/  # CI + release
```

## Conventions

- **Package manager:** npm 10 workspaces. Internal deps use `"@saas/ui": "*"`
  (the pnpm/yarn `workspace:*` protocol is not supported by npm).
- **Releases:** [changesets](https://github.com/changesets/changesets), semver,
  per-package `CHANGELOG.md`. Add one with `npx changeset`.
- **Commits:** conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`),
  imperative summary; scope like `feat(ui):` when it helps.
- See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the design-token workflow and
  the Figma style-naming contract.
