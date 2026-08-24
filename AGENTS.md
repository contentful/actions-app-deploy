# AGENTS.md — actions-app-deploy

Agent-first contract. Non-discoverable rules only. For commands and setup see
[CONTRIBUTING.md](./CONTRIBUTING.md); for structure see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Quick Reference

| What you need | Where to look |
|---|---|
| How this repo is structured | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| How to build / lint / release | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Why decisions were made | [docs/ADRs/](./docs/ADRs/) |
| What this Action does, for consumers | [README.md](./README.md) |
| The Action's input contract | [action.yml](./action.yml) |

## Guardrails

**`dist/` is a committed build artifact, and CI will fail if it is stale.**
GitHub Actions runs `dist/index.js` directly (`action.yml` → `runs.main`); it never builds from
`src/`. The CircleCI `lint-and-test` job runs `npm run build` and then fails if
`git status --porcelain` is non-empty. So:

- Any change under `src/` **must** be accompanied by a rebuilt, committed `dist/` in the same
  commit. Run `npm run build` and stage `dist/`.
- Never hand-edit `dist/index.js` or `dist/licenses.txt`. They are `@vercel/ncc` output. Edit
  `src/` and rebuild.
- A PR that changes only `src/` and passes review still ships **nothing**. Stale bundle = stale
  behavior in every consumer workflow.

**There are no tests. Do not trust `npm test`.**
`package.json` → `scripts.test` is the npm stub: `echo "Error: no test specified" && exit 1`. It
fails by design and CI does not run it. Do not "fix" it by making it exit 0 — either add real
tests behind it or leave it alone. Verification here is `format-check`, `lint`, `build`, and the
bundle-freshness check.

**Analytics are opt-out and must stay failure-silent.**
`src/analytics.ts` fires one Segment `branch_deployed` event with a hardcoded *public* write key.
Every failure path is deliberately swallowed (`errorHandler: () => {}` plus a bare `catch`):
telemetry must never fail a user's deploy. Do not add throws, retries, or awaits to that path.
Note the parameter reads `contentful_action_disable_analytics` but is fed the `allow-tracking`
input — tracking is skipped when the string is `"false"`. Confusing name, correct behavior;
if you rename it, keep the string comparison semantics identical.

## Conventions agents miss

- `.npmrc` sets `ignore-scripts=true`, so the `prepare` script (husky) does **not** run on
  `npm ci`. Git hooks are absent unless you run `npm run prepare` yourself. Do not assume a
  pre-commit hook formatted your code — run `npm run format` explicitly.
- Node 20 is pinned in three places that must agree: `.nvmrc` (`v20`), `action.yml`
  (`runs.using: node20`), and `@tsconfig/node20`. Bumping the runtime means editing all three.
- `catalog-info.yaml` is still partly the unfilled Backstage template (`tags: [update-me]`,
  `service-tier: "unknown"`, `sast-disabled`). Treat those as a known gap, not as facts about
  the service.

## Build & Quality

```bash
# Full local verification, mirroring the CircleCI job.
npm ci && npm run format-check && npm run lint && npm run build && git status --porcelain
# The last command must print nothing. Output means dist/ was stale — commit it.
```
