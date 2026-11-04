---
status: in-progress
topic: Like button with Neon
concepts: [postgres, neon, sql-schema, sql-queries, persistence]
level: trainee
mode: guided-feature
updated: 2026-11-04
---

## Agreement

Goal: like button on the `/` page of c12z, to learn databases.
You: schema (table) and queries (add a like, read the count).
Me: Neon connection, /api/likes route, button, tests.
Done: click → the count goes up and survives a reload.
Explanations: detailed, with examples.
Scope: no login, every click adds a like, even from the same person.
Level is a first guess: they said "principiante" and did not answer the SQL question.

    [Button] ──click──▶ [Route /api/likes] ──connection──▶ [Neon: queries + table]
       me                     me                 me               YOU

## Plan

- [ ] 1. Neon account + project, connection string in .env ← current
- [ ] 2. Install deps and connect from the API (me): `SELECT 1`
- [ ] 3. Schema: table for the likes (they write it)
- [ ] 4. Query: add a like (they write it)
- [ ] 5. Query: read the count (they write it)
- [ ] 6. Wire button → route → queries (me), run the done check

## Current step

Step 1: get a Neon project and save its connection string in `.env`.
Problem: the count needs to live outside the app; a variable in memory goes back to 0 when the server restarts.
Why this way: Neon is a Postgres server that runs apart from the app, so the data survives restarts.
Next: find out what they already have in Neon (unanswered). They create the account/project and the `.env`; the string must not be pasted in chat.
Pending approval: installing deps (`npm install`, plus a dev server and TS runner for Node). `npm view` needed approval and did not run, so the exact versions are still unchecked.

## Log

## Where it lives in the repo

- `src/index.ts` (route goes here, `// TODO: /api/likes`), `.env` (not created yet)

## Assets

- PostgreSQL — Concepts: https://www.postgresql.org/docs/current/tutorial-concepts.html (official)
