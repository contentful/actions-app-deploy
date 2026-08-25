# Contributing — actions-app-deploy

This Action runs from a **committed bundle**. Read the [Releasing](#releasing) and
[CI](#ci) sections before your first PR — the workflow here differs from a normal npm package.

## Prerequisites

- Node 20 — pinned in [`.nvmrc`](./.nvmrc). Use `nvm use` to match CI.
- npm (the repo uses `package-lock.json`; there is no pnpm/yarn config).
- A Contentful organization, an app definition, and a CMA token if you want to test end to end.

## Getting Started

```bash
nvm use
npm ci
npm run build          # tsc → build/, then ncc → dist/
```

Note that `.npmrc` sets `ignore-scripts=true`, so `npm ci` does **not** run the `prepare` script.
If you want the husky git hooks locally, run `npm run prepare` once, explicitly.

## Commands

| Command | What it does |
|---|---|
| `npm run build` | `rimraf build dist`, `tsc`, then `ncc build ./build/index.js --license licenses.txt`. Regenerates `dist/`. |
| `npm run lint` | ESLint over `src/*.ts`. |
| `npm run lint:fix` | ESLint with `--fix`. |
| `npm run format` | Prettier, writes `**/*.ts`. |
| `npm run format-check` | Prettier in check mode — this is what CI runs. |
| `npm test` | **Stub. Fails on purpose** (`echo "Error: no test specified" && exit 1`). |

## Testing

There is no automated test suite. `npm test` is the unmodified npm placeholder and CI does not
invoke it. Verification is: Prettier check, ESLint, a successful build, and the bundle-freshness
gate.

To test a change for real, push your branch and reference it from a scratch workflow in another
repository:

```yaml
- uses: contentful/actions-app-deploy@your-branch-name
  with:
    organization-id: ${{ secrets.CONTENTFUL_ORG_ID }}
    app-definition-id: ${{ secrets.CONTENTFUL_APP_DEF_ID }}
    access-token: ${{ secrets.CONTENTFUL_ACCESS_TOKEN }}
    folder: build
```

Because GitHub runs `dist/index.js` from whatever ref you name, **your branch must contain a
rebuilt `dist/`** for this to exercise your change at all.

## Code Style & Conventions

- Prettier owns formatting; do not fight it manually. Run `npm run format` before committing.
- ESLint with `@typescript-eslint` — config in [`.eslintrc.json`](./.eslintrc.json).
- Keep `src/` thin. Upload behavior belongs in `@contentful/app-scripts`, not here (see
  [ARCHITECTURE.md](./ARCHITECTURE.md)).

## The one rule that matters: rebuild `dist/`

Any change under `src/` must include the regenerated bundle in the same commit:

```bash
npm run build
git add src dist
git commit -m "feat: your change [EXT-1234]"
```

If you skip this, CI fails the "Build output is up-to-date" step, and — worse — a merged PR would
ship no behavior change at all.

## Commit Convention

Conventional Commits, as visible throughout the history: `feat:`, `fix:`, `chore:`,
`chore(deps):` for Renovate. Jira keys go in the subject in brackets, e.g.
`feat: add comment input [EXT-4220]`. There is no commitlint hook enforcing this — match the
existing history by hand.

## Pull Requests

- Squash-merge to `master` (note: the default branch is `master`, not `main`).
- `.github/CODEOWNERS` assigns all files to `@contentful/team-extensibility`, so a team review is
  required.
- Call out in the PR body whether consumer workflows need any change — every consumer on `@v1`
  inherits merged behavior as soon as the tag moves.

## CI

CircleCI, [`.circleci/config.yml`](./.circleci/config.yml), one `lint-and-test` job:

1. `npm ci`
2. `npm run format-check`
3. `npm run lint`
4. `npm run build`
5. **"Build output is up-to-date"** — fails if `git status --porcelain` is non-empty after the
   build. This is the stale-`dist/` gate.

GitHub Actions additionally runs CodeQL ([`.github/workflows/codeql.yml`](./.github/workflows/codeql.yml)).
No SAST workflow is enabled yet — `catalog-info.yaml` still carries the `sast-disabled` tag.

## Releasing

There is no npm package and no semantic-release. Releasing is tagging:

1. Merge to `master` with a fresh `dist/`.
2. Create the version tag, e.g. `git tag v1.2.0 && git push origin v1.2.0`.
3. **Move the floating major tag** so existing consumers get the change:
   `git tag -f v1 && git push -f origin v1`.
4. Draft GitHub release notes against the version tag.

Step 3 is the actual release. Skipping it means nobody consuming `@v1` sees your change. See
[docs/ADRs/2024-07-19-floating-major-version-tag-release.md](./docs/ADRs/2024-07-19-floating-major-version-tag-release.md)
for why it works this way and what it costs.
