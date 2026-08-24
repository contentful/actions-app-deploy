# Fire-and-forget, opt-out deploy analytics

## Status

Accepted

## Context

The App Framework team wanted to know whether and how the Action was being used — specifically
which app definitions deploy and from which branch (`feat: branch name on which action run
[EXT-4220]`, commit `2e882f9`). The Action runs inside *customer* CI, so any instrumentation
carries two risks: breaking someone's deploy, and collecting more than a customer expects.

## Decision

Send exactly one Segment event, `branch_deployed`, with two properties: `branch_name` (from
`github.context.ref`) and `app_key` (the app definition id). Three constraints hold it in place:

- **Opt-out via the `allow-tracking` input**, defaulted to `true` in `action.yml`. When the input
  is the string `"false"`, `track()` returns before constructing a client.
- **Failure-silent.** The Segment client is built with `errorHandler: () => {}` and the whole body
  sits in a `try`/`catch` that swallows everything. Telemetry cannot fail a deploy.
- **Not correlatable.** `anonymousId` is `Date.now()`, so events cannot be joined into a per-user
  or per-repo series. The write key in `src/analytics.ts` is a public, data-source-scoped Segment
  write key, safe to commit.

## Consequences

- **Enables:** usage signal for a tool the team otherwise cannot observe, at effectively zero risk
  to consumers.
- **Trade-off:** the data is coarse by construction. Because `anonymousId` is a timestamp, you
  cannot count distinct consumers or build retention series — only event volume and the
  distribution of `app_key` / `branch_name`. That was the accepted price of not identifying
  customers.
- **Trade-off:** silent failure means broken telemetry is invisible. If the event volume ever
  looks wrong, suspect the pipeline before concluding usage dropped.
- **Known wart:** the parameter is named `contentful_action_disable_analytics` but receives the
  `allow-tracking` input, so it reads as inverted. Behavior is correct (skip when `"false"`); the
  name is not. Any rename must preserve the exact string comparison.
- `analytics-node` is deprecated upstream. Replacing it is safe only if the three constraints
  above survive the swap.
