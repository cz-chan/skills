---
description: The API runs on Hono because it is small, and the data lives in Neon because it needs no operations work.
created: 2026-11-08
code: [package.json, src/api/, src/db/]
reviewed: 7e6bd2b
---

# Stack

| Technology                                        | Serves                                    | Why                                                                       |
| ------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------- |
| Hono 4.6.0                                        | [API](../architecture/README.md)          | Small ([why](../decisions/use-hono-20261108195403.md))                    |
| Neon Postgres (`@neondatabase/serverless` 0.10.0) | [Database](../architecture/README.md)     | No operations work ([why](../decisions/use-neon-20261108195403.md))       |
