# Release by moving a floating major version tag

## Status

Accepted

## Context

The Action is consumed as `contentful/actions-app-deploy@<ref>`. GitHub resolves that ref at
workflow run time, so the release mechanism is whatever the ref points at — there is no npm
package and no `semantic-release` in this repo, unlike most Contentful packages.

The ecosystem convention for Actions is that consumers pin a major (`@v1`) and receive
non-breaking updates automatically, in exchange for the publisher promising compatibility within
that major.

## Decision

Follow the ecosystem convention. Each release gets an immutable `vX.Y.Z` tag, and the floating
`v1` tag is force-moved to the same commit. As of the last release, `v1` and `v1.1.0` both point
at commit `6733526`.

Releasing is therefore a manual, three-step act: tag the version, force-move the major tag, draft
release notes.

## Consequences

- **Enables:** consumers get fixes — including inlined dependency security fixes, which matter
  more here because of the committed bundle — without editing their workflows. It matches what
  every other Action in a consumer's workflow file does.
- **Trade-off:** merged is not released. Someone must remember step 3 (`git tag -f v1 && git push
  -f origin v1`), and nothing in CI enforces or reminds. A merged PR sitting un-tagged looks
  shipped and is not.
- **Trade-off:** the blast radius of a mistake is immediate and total. Moving `v1` publishes to
  every consumer at once with no staged rollout and no opt-in; a regression is only recoverable by
  force-moving `v1` back.
- **Trade-off:** force-pushing a tag is not auditable in the way an immutable publish is. The
  `vX.Y.Z` tags are the real record of what was released when.
- **Follow-up worth considering:** automate the tag move in CI on merge to `master`, so "merged"
  and "released" stop diverging.
