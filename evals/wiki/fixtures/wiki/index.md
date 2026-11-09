# Recetario

Save recipes and share them through a link, for home cooks.

## Layers

| Layer | Answers | Status |
| ----- | ------- | ------ |
| [Product](product/README.md) | What it does, for whom | complete |
| [Architecture](architecture/README.md) | The pieces, and why this shape | complete |
| [Stack](stack/README.md) | The technology, and why | complete |

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
