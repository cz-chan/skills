---
status: in-progress
topic: Botón de likes con Neon
concepts: [postgres, neon, db-connection, env-vars, sql-insert]
level: junior
mode: guided-feature
updated: 2026-11-04
---

## Agreement

Goal: botón de likes en c12z.io, para aprender bases de datos.
You: setup de Neon, conexión, esquema, queries de insert y count.
Me: UI del botón, cableado de la ruta API, tests.
Done: click → el contador sube y se mantiene al recargar.

    [Botón] ──click──▶ [API /likes] ──query──▶ [Neon DB]
       yo                  yo                     TÚ

## Plan

- [x] 1. Proyecto en Neon + connection string en .env
- [x] 2. Conectar desde la API
- [ ] 3. Esquema: tabla `likes` ← current
- [ ] 4. Insertar un like
- [ ] 5. Contar likes por post
- [ ] 6. Conectar botón → API → DB

## Current step

Step 3: `likes` table. Stopped mid-step on 2026-11-04.
Problem: nothing stores a like yet, so the count would be lost on a reload.
Why this way: one row per like, not a counter column; the count is computed by
counting rows, and when/who is kept.
Done: learner decided the columns: `post_id`, `user_id`, `created_at`.
Left: choose each column's type, write `CREATE TABLE`, run it in Neon's SQL
Editor, check the table exists and returns 0 rows. Nothing written or run yet.
Open:
- `user_id`: the repo has no login, so settle where its value comes from when
  choosing the type.
- Repo does not match steps 1-2 (checked 2026-11-04): no `.env`, no
  `src/pages/api/likes.ts`, no Neon code in `src/index.ts` (only
  `// TODO: /api/likes`), no `node_modules`. Learner has not said whether the
  work is elsewhere, needs redoing here, or must restart from step 1. Neon
  project not verified. Ask first next session; plan left unchanged.
- `.gitignore` has only `runs/`: add `.env` before committing one.

## Log

### 1. Proyecto en Neon + .env — 2026-10-12

- Did: creó el proyecto en Neon y guardó la connection string en `.env`.
- Stuck on: no sabía qué significaba `?sslmode=require` y lo borró.
- Solved by: se explicó cada parte de la URL y leyó la página "Connect" de
  Neon.
- Lesson: la connection string no es solo una dirección: lleva usuario,
  contraseña, host, nombre de la DB y opciones. `sslmode=require` obliga a
  cifrar la conexión; sin él, Neon la rechaza porque no acepta conexiones
  sin cifrar. Regla: no borres parámetros de una URL de conexión sin saber
  qué hacen. Si la conexión falla justo después de editar la URL, revisa
  primero lo que quitaste.

### 2. Conectar desde la API — 2026-10-13

- Did: `SELECT 1` desde la ruta de Hono con `@neondatabase/serverless`.
- Stuck on: importó el cliente de la DB en un componente del navegador, así
  que la connection string llegaba al cliente.
- Solved by: movió la query a la ruta del servidor y leyó la variable de
  entorno allí.
- Lesson: todo el código que corre en el navegador es público: se descarga
  y cualquiera puede leerlo en las devtools. La connection string contiene
  la contraseña de la DB, así que solo puede vivir en el servidor, y el
  cliente habla con la DB únicamente a través de tu API. Próxima vez: antes
  de usar un secreto en un archivo, pregúntate dónde se ejecuta ese archivo.

## Where it lives in the repo

- `src/pages/api/likes.ts`, `.env`

## Assets

- Neon — Connect from any app: <url> (official)
- Hono — Environment variables: <url> (official)
