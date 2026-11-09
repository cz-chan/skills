# Layers format

The wiki lives in `.wiki/`, and everything in it is in English. Fit each file to
the product: small products get short files.

Layers say how the product is today. For how it got there, link to a decision (see
[DECISION-FORMAT.md](DECISION-FORMAT.md)).

## Layout

```
.wiki/
  index.md
  product/
    README.md        what it does and what it solves
    users.md
    use-cases/
      <slug>-<id>.md  one per use case
  architecture/
    README.md        diagram and pieces
    <piece>.md       one per piece worth explaining
  stack/
    README.md        table of technologies
    <technology>.md  only when there is something to explain
  decisions/
  work/
```

## Other layers

`product/`, `architecture/` and `stack/` are the default layers. The user can add, rename,
reorder or drop layers to fit how they work, such as `design/` or `compliance/`. Each
layer is a folder with a `README.md`, listed in `index.md` from highest to lowest, and
follows the same rules: frontmatter, citations to the layer above, and `code` and
`reviewed` if it describes code.

## `index.md`

The entry point for agents and people, including those who do not have this skill. It
lists no decisions: two branches adding decisions would conflict here on every merge.

```md
# {Product}

{One sentence: what it does and for whom.}

## Layers

| Layer                                  | Answers                        | Status   |
| -------------------------------------- | ------------------------------ | -------- |
| [Product](product/README.md)           | What it does, for whom         | complete |
| [Architecture](architecture/README.md) | The pieces, and why this shape | draft    |
| [Stack](stack/README.md)               | The technology, and why        | missing  |

## How to use this wiki

- Read from the top, and stop at the layer you need.
- Every file has a one-line `description` in its frontmatter. To see every decision without opening
  them, run `grep -rE '^(status|description|code):' .wiki/decisions`, and open only the current ones that apply.
- Before changing something, read the current decisions in `decisions/` that list its code.
- Skip decisions with `status: superseded` and work with `status: done`, unless you need the history.
- Before relying on a file with `code` and `reviewed`, run `git log <reviewed>.. -- <paths>`. If that
  code changed, say the file may be out of date, and check it against the code.
- Layers say how it is today. Decisions say why, and are never deleted.
- Work in progress is in `work/`. To list what is active, run this from the repo root:
  `grep -rlE 'status: (in-progress|blocked)' .wiki/work`
- Never invent anything. Product, use cases, architecture, stack, infrastructure, any other
  layer and decisions need a person's approval of the exact text. For the rest, write it and say what you did.
- Never write sensitive data here. If something might be sensitive, stop and tell the user first.
- Agents never commit anything in this folder unless the user explicitly asks them to.
```

## Citations between layers

Each element in a lower layer says what it serves in the layer above, with a standard
markdown link. This is how the layers stay connected: when something above changes,
search the layer below for links to it, and those are the parts to review.

```md
Serves: [share recipe](../product/use-cases/share-recipe-20261109143052.md)
Serves: [data](../architecture/data.md)
```

Important claims link to the decision behind them:

```md
Recipes live in one Postgres database ([why](../decisions/use-neon-20261108101500.md)).
```

## Frontmatter

Every layer file starts with:

```md
---
description: Recipes live in one Postgres database, reached only through the API.
created: 2026-11-08
---
```

- `description`: one line stating what the file concludes, not its topic.
- `created`: the date the file was added.

Layers describe what exists today, so they have no `closed`.

## Freshness

Files in layers that describe code, such as architecture and stack, also have:

```md
code: [src/db/, migrations/]
reviewed: a1b2c3d
```

- `code`: the paths this file describes.
- `reviewed`: the short commit at which someone last checked this file against that code
  (`git rev-parse --short HEAD`). Use `none` if the repo has no commits yet.

`git log <reviewed>.. -- <paths>` shows what changed since. Update `reviewed` only after
actually checking the file. The product layer has neither field, because it does not
follow the code: review it by asking whether it is still true.

## product

`README.md`

```md
# Product

{What it does, in plain words.}

## Problem

{The problem, who has it, and how they solve it today.}

## Solution

{How the product solves that problem.}

## Why this product

{Why it is worth building, or what it does better.}

## Out of scope

- {What it deliberately does not do, and why.}
```

`users.md`: one section per kind of user, saying who they are and what they want from it.

`use-cases/<slug>-<id>.md`: one file per use case. `<slug>` is a short English name and
`<id>` is the UTC creation time as a number (`date -u +%Y%m%d%H%M%S`). Get it from that
command, never from memory. The slug goes first so the name is easy to scan, and the id
makes it unique, so two branches cannot create the same file.

```md
---
description: {Who} {does what}, and {gets what result}.
created: {YYYY-MM-DD}
---

# {Short name}

{Who} {does what}, and {gets what result}.
```

Be specific enough to rule things out. "Helps people organize their work" could describe
anything; "freelancers lose unbilled hours because they track time in spreadsheets"
points to a product. A use case is something a person does and what they get, not a
feature name.

## architecture

`README.md`

```md
# Architecture

{ASCII diagram of the pieces and how they connect.}

- [{Piece}]({piece}.md): {what it does}. Serves: [{use case}](../product/use-cases/{slug}-{id}.md).

Why this shape: {the reason, linking to its decision}.
```

`<piece>.md`: add one only when a piece has something the diagram cannot say.

```md
# {Piece}

{What it does and what it is responsible for.}

Serves: [{use case}](../product/use-cases/{slug}-{id}.md)

## Connects to

- {Other piece}: {what passes between them, and how}.

## Traps

- {What looks safe to change and is not, and why.}
```

Include where the data lives and how the pieces talk to each other. Every piece should
trace back to a use case; if none does, say so, because it is either undocumented or
unneeded.

## stack

`README.md`

```md
# Stack

| Technology | Serves                                | Why                               |
| ---------- | ------------------------------------- | --------------------------------- |
| {Name}     | [{piece}](../architecture/{piece}.md) | {reason, linking to its decision} |
```

`<technology>.md`: add one only for setup or usage that the code and the official docs do
not explain, such as why it is pinned or how it is configured here.

Take names and versions from the manifests and lockfiles, not from memory. Do not list
every dependency: only those that shape how the product is built. "It is popular" is not
a reason; if nobody knows the reason, write that it is unknown, or an
`Assumption:` the user has accepted.

## Splitting

Keep one topic per file. Split a file when it covers two unrelated things, not because
it is long. Stay one level deep inside each layer, apart from `product/use-cases/`, and
update the links that pointed to the old file.
