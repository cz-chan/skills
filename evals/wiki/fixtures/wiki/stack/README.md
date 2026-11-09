---
description: Hono for the API and Neon for the database.
created: 2026-10-01
code: [package.json]
reviewed: REVIEWED_SHA
---

# Stack

| Technology | Serves | Why |
| ---------- | ------ | --- |
| Hono | API | Small and fast ([why](../decisions/use-hono-20261001101500.md)) |
| Neon | [Data](../architecture/data.md) | No operations work ([why](../decisions/use-neon-20261001101000.md)) |
