# Decision format

One decision per file, in `.wiki/decisions/`, named `<slug>-<id>.md`: a short English
slug, then the UTC creation time as a number (`date -u +%Y%m%d%H%M%S`). Get it from that
command, never from memory. The slug goes first so the name is easy to scan, and the id
makes it unique, so two branches can add decisions without conflicting.

Everything in the file is in English.

## Template

```md
---
status: current
description: {The conclusion and its main reason, in one line.}
created: {YYYY-MM-DD}
closed:
superseded_by:
code: [src/db/]
---

# {The decision, as a short statement}

## Decision

{What was decided, specific enough to act on.}

## Why

{The reason, as given by the person who decided. The constraints that made it right at
the time.}

## Discarded

- {Alternative}: {why not}.

## Changes

- {YYYY-MM-DD}: {what changed}. Why: {the reason}.
```

- `status`: `current` or `superseded`.
- `description`: what was decided and why, so an agent can tell whether to open the file.
- `created`: the date it was recorded.
- `closed`: the date it was superseded. Empty while it is current.
- `superseded_by`: file name of the decision that replaced it, when `superseded`.
- `code`: the paths it affects, so an agent about to change them can find it.
- Add `reconstructed: true` when it was written after the fact, from an interview.

Leave `## Changes` empty until there is one. If nobody knows the reason, write that it is
unknown. A guess goes in only if the user accepts it, on a line starting with
`Assumption:` so it can be revisited.

## Which change is which

Ask whether the original `## Why` still holds.

- **It holds:** this is an adjustment. Add a dated line to `## Changes`.
- **It does not hold:** this is a change of direction. Write a new decision, and mark the
  old one superseded.

The body of a past decision stays as written, because it records what was true then.
After it is recorded, only `status`, `description`, `closed`, `superseded_by`, `code` and
`## Changes` change.

## Example: an adjustment

```md
## Changes

- 2026-11-20: moved from the free tier to the paid tier. Why: the free tier suspends the
  database when idle, and the first request after that timed out.
```

The product still uses Neon for the same reasons, so this is a line, not a new decision.

## Example: a change of direction

`decisions/use-neon-20261108101500.md`, after being replaced:

```md
---
status: superseded
description: Database was Neon Postgres, for one developer with no operations experience.
created: 2026-11-08
closed: 2027-02-03
superseded_by: move-to-rds-20270203160412.md
code: [src/db/]
---

# Use Neon for the database

## Decision

Keep recipes in a Neon Postgres database.

## Why

One developer, no operations experience, and a usage-based bill while traffic is low.

## Discarded

- Self-hosted Postgres: nobody on the project wants to run backups.

## Changes

- 2026-11-20: moved from the free tier to the paid tier. Why: the free tier suspends the
  database when idle, and the first request after that timed out.
- 2027-02-03: superseded. Why: see the new decision.
```

`decisions/move-to-rds-20270203160412.md`:

```md
---
status: current
description: Database is Postgres on AWS RDS, because a customer contract requires AWS.
created: 2027-02-03
closed:
superseded_by:
code: [src/db/, infra/]
---

# Move the database to RDS

## Decision

Keep recipes in Postgres on AWS RDS.

## Why

A customer contract requires the data to stay inside our AWS account. Replaces
[Use Neon](use-neon-20261108101500.md), whose reasons no longer outweigh this requirement.

## Discarded

- Staying on Neon: it cannot meet the contract.
```

## What makes a good decision record

**Why.** The most valuable section, and the only one nobody can recover later. It
explains the constraints, so a future reader can tell whether they still apply. "It is
better" says nothing; "one developer with no operations experience" can be checked.

**Discarded.** Stops the next person or agent from proposing the same thing again. If
nothing else was considered, say so.

**Size.** A decision is usually under thirty lines. Implementation detail belongs in the
code, and how things work today belongs in the layers.
