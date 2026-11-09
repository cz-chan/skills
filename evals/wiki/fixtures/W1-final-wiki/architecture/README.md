---
description: One API in front of one Postgres database, and today the code only reads a recipe by id.
created: 2026-11-08
code: [src/]
reviewed: 7e6bd2b
---

# Architecture

    client --> API --> database

- API (`src/api/`): today it only reads a recipe by id. Nothing mounts it yet, and saving or finding recipes has no code yet.
  Serves: [save and find](../product/use-cases/save-and-find-recipe-20261108195241.md), [read shared recipe](../product/use-cases/read-shared-recipe-20261108195241.md).
- Database (`src/db/`): one Postgres database, reached through `DATABASE_URL`.
  Serves: [save and find](../product/use-cases/save-and-find-recipe-20261108195241.md), [read shared recipe](../product/use-cases/read-shared-recipe-20261108195241.md).
- Share (`src/share/`): computes when a shared link expires ([why 30 days](../decisions/share-link-expiry-20261108195241.md)). Nothing calls it yet.
  Serves: [read shared recipe](../product/use-cases/read-shared-recipe-20261108195241.md).
- Auth (`src/auth/`): an empty list of providers. Whether and how cooks sign in is not decided yet, so it serves no use case today.

Why this shape: unknown.
