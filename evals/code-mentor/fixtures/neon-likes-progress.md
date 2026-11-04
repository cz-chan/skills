---
status: in-progress
topic: Like button with Neon
concepts: [postgres, neon, db-connection, env-vars, sql-insert]
level: junior
mode: guided-feature
updated: 2026-10-13
---

## Agreement

Goal: like button on c12z.io, to learn databases.
You: Neon setup, connection, schema, insert and count queries.
Me: button UI, API route wiring, tests.
Done: click → the count goes up and survives a reload.

    [Button] ──click──▶ [API /likes] ──query──▶ [Neon DB]
       me                  me                    YOU

## Plan

- [x] 1. Neon project + connection string in .env
- [x] 2. Connect from the API
- [ ] 3. Schema: `likes` table ← current
- [ ] 4. Insert a like
- [ ] 5. Count likes per post
- [ ] 6. Wire button → API → DB

## Current step

Step 3: design the `likes` table. Next: decide the columns
(`post_id`, `created_at`, `user_id`?).

## Log

### 1. Neon project + .env — 2026-10-12

- Did: created the Neon project and saved the connection string in `.env`.
- Stuck on: did not know what `?sslmode=require` meant and deleted it.
- Solved by: each part of the URL was explained; read Neon's "Connect" page.
- Lesson: a connection string is not just an address: it holds the user,
  password, host, database name and options. `sslmode=require` forces an
  encrypted connection; without it Neon rejects the connection because it
  does not accept unencrypted ones. Rule: do not remove parameters from a
  connection URL without knowing what they do. If the connection fails right
  after editing the URL, check first what you removed.

### 2. Connect from the API — 2026-10-13

- Did: `SELECT 1` from the Hono route with `@neondatabase/serverless`.
- Stuck on: imported the DB client in a browser component, so the
  connection string reached the client.
- Solved by: moved the query to the server route and read the environment
  variable there.
- Lesson: all code that runs in the browser is public: it gets downloaded
  and anyone can read it in devtools. The connection string contains the DB
  password, so it can only live on the server, and the client talks to the
  DB only through your API. Next time: before using a secret in a file, ask
  yourself where that file runs.

## Where it lives in the repo

- `src/pages/api/likes.ts`, `.env`

## Assets

- Neon — Connect from any app: <url> (official)
- Hono — Environment variables: <url> (official)
