---
status: in-progress
topic: Like button with Neon
concepts: [postgres, neon, connection-string, env-vars, create-table, sql-insert, sql-count]
level: trainee
mode: guided-feature
updated: 2026-11-04
---

## Agreement

Goal: like button on c12z.io, to learn databases.
User: schema (CREATE TABLE) and queries (add a like, read the count).
Me (code in the console, user pastes it): Neon setup guidance, connection, Hono routes /api/likes, button UI, test.
Done: click → count goes up → reload → count stays.
Scope: one button, one global counter, no login; one person can like many times.
Explanations: detailed, with examples.

    [Button] ──click──▶ [Hono /api/likes] ──user's query──▶ [Neon]
       me                     me                 USER: table and queries

## Plan

- [ ] 1. Neon project + connection string in .env + connection check ← current
- [ ] 2. Schema: `likes` table (user)
- [ ] 3. Query: add a like (user)
- [ ] 4. Query: read the count (user)
- [ ] 5. Wire routes and button (me, in the console)
- [ ] 6. Done check: click, count goes up, reload, count stays

## Current step

Step 1: create the Neon project, store the connection string in .env, check the connection.
Problem: the app has no database, so nothing can survive a reload.
Why this way: the connection string holds the DB password, so it lives in .env, ignored by git, and only the server reads it.
Next: user adds .env and node_modules/ to .gitignore, creates the Neon project, saves DATABASE_URL.
Level: user said "principiante" and did not answer the SQL experience question; starting at trainee.

## Log

## Where it lives in the repo

- `src/index.ts`, `.env`

## Assets
