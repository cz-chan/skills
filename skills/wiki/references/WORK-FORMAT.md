# Work format

One file per piece of ongoing work, in `.wiki/work/<topic>-<id>.md`: a short English
topic, then the UTC creation time as a number (`date -u +%Y%m%d%H%M%S`). Get it from that
command, never from memory. The id makes the name unique, so new work on a topic never
overwrites a finished file, and it does not change while the work lasts.

The file exists so the next agent or person can pick up without asking what was going on.
Everything in the file is in English.

## Template

```md
---
status: in-progress
description: {What is being done and where it stands, in one line.}
branch: feat/social-login
created: 2026-11-08
updated: 2026-11-08
closed:
---

# {What is being done}

## Goal

{What is true when this is finished.}

## State

- [x] {Done}
- [ ] {Not done yet} ← current

## Next step

{The one thing to do next, specific enough to start without asking.}

## Open decisions

- {A question nobody has settled yet, and the options.}
```

- `status`: `in-progress`, `blocked` or `done`. If blocked, say on what in `## Next step`.
- `description`: one line, so an agent can tell whether to open the file.
- `branch`: where the work is happening, if it has one.
- `created` and `closed`: when the work started and finished. `closed` stays empty until
  then.

## Rules

Keep it short and current. It describes where the work stands, not its history: git and
the decisions hold that.

Only unsettled questions go in `## Open decisions`. Once a person settles one, it moves
to `decisions/` straight away, so nobody has to find it in a work file.

This file should be committed with the work it describes, so remind the user. Agents
never commit it unless the user explicitly asks. On a branch it only reaches other
people and agents when that branch is pushed or merged.

## Finishing

Recording decisions and changing product, architecture or stack content need the user's
yes on the exact text. Closing the file does not: do it, and tell them.

1. Settle or drop what is left in `## Open decisions`, and record what was decided.
2. Update the layers to match what now exists.
3. Set `status: done` and `closed` to today's date, and keep the file. Searches skip it by
   its status, so it costs nothing to keep.

A file whose `updated` is old may be abandoned. Ask before picking it up or closing it.
