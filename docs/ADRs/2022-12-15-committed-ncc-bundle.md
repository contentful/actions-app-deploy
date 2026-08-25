# Ship a committed `ncc` bundle as the Action entry point

## Status

Accepted

## Context

A JavaScript GitHub Action is executed directly by the runner: GitHub checks out the ref named in
`uses:` and runs the file named by `action.yml` → `runs.main`. There is no install step and no
`node_modules` — whatever dependencies the entry point needs must already be resolvable at that
path.

This repo is written in TypeScript (`chore: github action in typescript [EXT-4116]`, commit
`dfe00c4`) and depends on `@contentful/app-scripts`, `@actions/core`, `@actions/github`, and
`analytics-node`. So the source cannot be the entry point, and shipping `node_modules` is not
viable.

The options were: commit a bundled artifact; publish to npm and have a tiny shim install it at
runtime; or use a Docker-based action.

## Decision

Compile with `tsc`, bundle with `@vercel/ncc` into a single self-contained `dist/index.js`
(plus `dist/licenses.txt`), and **commit `dist/` to the repository**. `action.yml` points
`runs.main` at `dist/index.js` with `runs.using: node20`.

To keep the committed artifact honest, the CircleCI `lint-and-test` job runs `npm run build` and
then fails if `git status --porcelain` reports anything — a "Build output is up-to-date" gate.

## Consequences

- **Enables:** zero-install, fast Action startup; no npm publish in the release path; consumers
  pin a git ref and get a working Action with no network beyond the checkout.
- **Trade-off:** `dist/` is generated code in version control. Diffs are large and unreviewable,
  merge conflicts in `dist/` are routine, and every `src/` change carries a mandatory rebuild
  step. Forgetting it means a merged PR that changes nothing at runtime — the failure is silent
  from the author's point of view, which is precisely why the CI gate exists.
- **Trade-off:** the bundle inlines dependency code, so a transitive vulnerability is only fixed
  once someone rebuilds and commits — a lockfile bump alone does not ship the fix.
- **Constraint for agents and contributors:** never hand-edit `dist/`. Edit `src/`, run
  `npm run build`, commit both.
