# Maintaining domain files

Domain files get better after each session. Only write with the user's OK, and always in English.

Write only to `.socrates/domains/` at the project root (see "Project folder" in SKILL.md for why and for consent).

## No domain file was used

Ask: "There's no guide for <domain> yet. Want me to create `.socrates/domains/<domain-slug>.md` from today's session?"

If this session's note went to `.socrates/notes/<slug>/`, use that same `<slug>` for the domain file so notes and domain stay paired.

On yes:

1. Fill [domain-template.md](domain-template.md) with what worked this session: the anchors you used, the mini-example that landed, the errors the user made.
2. Ask if they have links they trust for `## Resources`. Leave it empty otherwise.
3. Save it and tell the user the path — they can edit it any time.

## A domain file was used

Propose 1–3 concrete additions from this session (a new typical error, a mini-example that worked, a better anchor). Show them as a short list, saying where each goes; apply only the ones the user accepts.

- Advice that holds for the whole domain → the main file.
- Material tied to one concept (a mini-example, a scaffolding table, concept-specific errors) → `.socrates/domains/<domain>/<topic-slug>.md`, created if needed.

Keep the main file under ~80 lines. If an addition would push it over, move concept-specific material out to topic files. A guide that keeps growing gets skimmed, and the useful parts get lost.
