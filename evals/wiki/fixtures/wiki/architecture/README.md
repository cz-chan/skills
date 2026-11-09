---
description: One API in front of one Postgres database; share links expire after 30 days.
created: 2026-10-01
code: [src/api/, src/share/]
reviewed: REVIEWED_SHA
---

# Architecture

    [Client] -> [API] -> [Database]

- [Data](data.md): stores recipes. Serves: [save a recipe](../product/use-cases/save-recipe-20261001100500.md).
- API: reads and writes recipes. Serves: [share a recipe](../product/use-cases/share-recipe-20261001100000.md).

Share links expire after 30 days ([why](../decisions/share-links-expire-20261002090000.md)).
