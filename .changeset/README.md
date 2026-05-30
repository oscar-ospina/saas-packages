# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).
Public, user-facing changes to a published package (`@saas/ui`) require a
changeset:

```bash
npx changeset
```

Pick the package(s), the bump type (patch/minor/major), and write a one-line
summary. Commit the generated `.md` file with your change. On merge to `main`,
the release workflow opens a "Version Packages" PR that applies the bumps and
updates each package's `CHANGELOG.md`; merging that PR publishes.

The example app under `examples/` is `private` and is never versioned or
published (`privatePackages.version: false`).
