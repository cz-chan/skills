---
status: done
topic: Like button with Neon
concepts: [postgres, neon, create-table, primary-key, not-null, default, sql-insert, sql-update, atomic-update, env-vars, hono-routes, http-methods, fetch]
level: trainee
mode: guided-feature
updated: 2026-11-04
---

## Agreement

Goal: like button with a global counter, to learn databases.
You, with guidance: schema, queries, connection; Neon project + DATABASE_URL once Neon is available.
Me (code in the console, you paste it): /api/likes route, button.
Constraint: cannot install packages and has no Neon here. Chose to write for Neon without running it (rejected the SQLite practice option).
Done here: code written and reviewed by reading only. NOT executed, so NOT proven to work.
Done final (pending, needs Neon and npm install): click → count goes up and survives a reload.
Explanations: detailed, with examples.

    [Button] ──click──▶ [/api/likes] ──▶ [queries] ──▶ [Neon]
       me                   me              YOU         YOU

## Plan

- [x] 1. Schema: `db/schema.sql` (reviewed by reading, not executed)
- [x] 2. Queries: `db/queries.sql` (reviewed by reading, not executed)
- [x] 3. Connection: `src/db.ts` (reviewed by reading, not executed)
- [x] 4. Paste route + button (given in console; reviewed by reading, not executed)
- [ ] 5. With Neon: taken over by the learner on their own, outside this task. Not done and not verified.

## Summary

Closed at the learner's request on 2026-11-04. Learned table design, the atomic UPDATE, env vars for secrets, and how browser, route and DB connect.
The agreed "done here" is met (code written and reviewed by reading). Nothing has been executed, so the final done check (click → count goes up and survives a reload) was never run and the feature is NOT proven to work.
Final quiz: wrong (chose `button.disabled` over the UPDATE to stop two people losing a like); corrected, see the step 4 log. All work is uncommitted; learner declined committing earlier.

## Left for the learner (step 5)

- Create the Neon project, put DATABASE_URL in `.env`, npm install.
- Run `db/schema.sql` once; `SELECT * FROM likes;` should return `1 | 0`. From total 0, both queries in `db/queries.sql` should return `1`.
- `package.json` has no runtime adapter or start script. `process.env` assumes Node or Bun; choose the runtime and how `.env` is loaded.
- The `./db` import may need another form depending on the runtime (e.g. `./db.js`).
- TypeScript may need a type for `rows[0].total` with driver 0.10.0.
- Unverified: the 0.10.0 README could not be fetched (npm returned 403). Current Neon docs show `neon(url)` + tagged template; the changelog implies it already worked before 1.0.0.
- POST has no limit on repeated likes (named once to the learner).

## Log

### 1. Schema — 2026-11-04

- Did: wrote `db/schema.sql` with the `likes` table and its starting row. Reviewed by reading; not executed.
- Stuck on: nothing
- Lesson: `CREATE TABLE` only creates an empty structure, so a counter also needs its starting row inserted, or later updates change 0 rows without any error.

### 2. Queries — 2026-11-04

- Did: wrote `db/queries.sql` with the atomic UPDATE and the SELECT. Reviewed by reading; not executed.
- Stuck on: said "no lo pillo" before this step; the cause was not confirmed (assumed running the schema twice). No attempt failed.
- Solved by: traced running the schema twice with total 5, and two simultaneous clicks with total 7.
- Lesson: reading a value in the app and then saving value + 1 loses likes, because two clicks can both read 7 and both save 8, with no error. `SET total = total + 1` lets the database do the sum on the current value while it locks the row, so the second click waits and gets 9. Rule: send the operation, not an already calculated number. Spot it when a SELECT's result feeds a later UPDATE of the same row.

### 3. Connection — 2026-11-04

- Did: wrote `src/db.ts` with `addLike` and `getLikes`, read `DATABASE_URL` from the environment with a missing-value check, and added `.env` to `.gitignore`. Reviewed by reading; not executed.
- Stuck on: hardcoded the connection string in the code at first, and did not understand the fix when first told ("no lo pillo").
- Solved by: env vars were re-explained as values the program receives from outside when it starts, with a before/after diagram and one change at a time.
- Lesson: anything written in the code reaches git, and removing it later does not remove it from history, so a connection string with a password must stay out of the code. The program reads `process.env.DATABASE_URL`, and the value lives in `.env`, which git ignores. Add `.env` to `.gitignore` before creating it, and check for a missing value so the error names the cause. Next time, before pasting any value, ask: would I be fine with anyone who reads the repo seeing this?

### 4. Route + button — 2026-11-04

- Did: pasted the given route and button code into `src/index.ts`. Reviewed by reading; not executed.
- Stuck on: did not follow the first overview of the step (browser, route and DB together, several new terms at once). In the final quiz, chose `button.disabled` as what stops two different people losing a like.
- Solved by: followed one click from total 41 to 42 through browser, server and Neon, and showed that only the browser-to-server link was missing. The quiz answer was corrected by tracing two browsers from total 7 to 9.
- Lesson: the browser never talks to the database. It calls a route on the server, the route calls a function, and the function runs the SQL, then the result travels back the same way. GET only reads and POST changes data, so a reload cannot add a like. `button.disabled` only runs in one browser, so it stops one person's double click but cannot see anyone else; between two people, only the database's `SET total = total + 1` protects the count. To spot this, ask where a protection runs and who it can see. Next time a flow feels confusing, follow one real value through it, one place at a time.

## Where it lives in the repo

- `db/schema.sql`, `db/queries.sql`, `src/db.ts`, `src/index.ts`

## Assets

- PostgreSQL — Table Basics: https://www.postgresql.org/docs/current/ddl-basics.html (official)
- PostgreSQL — Constraints: https://www.postgresql.org/docs/current/ddl-constraints.html (official)
- PostgreSQL — Default Values: https://www.postgresql.org/docs/current/ddl-default.html (official)
- PostgreSQL — Inserting Data: https://www.postgresql.org/docs/current/dml-insert.html (official)
- PostgreSQL — Updating Data: https://www.postgresql.org/docs/current/dml-update.html (official)
- PostgreSQL — Returning Data: https://www.postgresql.org/docs/current/dml-returning.html (official)
- PostgreSQL — Querying a Table: https://www.postgresql.org/docs/current/tutorial-select.html (official)
- PostgreSQL — Transaction Isolation: https://www.postgresql.org/docs/current/transaction-iso.html (official)
- Neon — Serverless driver: https://neon.com/docs/serverless/serverless-driver (official)
- Neon — Connect from any application: https://neon.com/docs/connect/connect-from-any-app (official)
- Hono — Routing: https://hono.dev/docs/api/routing (official)
- Hono — Context: https://hono.dev/docs/api/context (official)
- MDN — Using the Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch (official)
- MDN — GET: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET (official)
