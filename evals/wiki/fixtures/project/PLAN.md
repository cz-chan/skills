# Plan: Recetario

## Why

Home cooks lose recipes across screenshots and chats.

## Use cases (v1)

1. A cook saves a recipe, and finds it later.
2. A visitor opens a shared link and reads the recipe without an account.

## Architecture

API in front of one database.

## Stack

| Piece | Choice | Why | Discarded |
| ----- | ------ | --- | --------- |
| API   | Hono   | Small | Express |
| Data  | Neon   | No operations work | Self-hosted Postgres |
