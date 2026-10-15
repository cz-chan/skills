# Domain template

Structure for `.socrates/domains/<domain-slug>.md`. Keep it under ~80 lines; concrete examples beat general advice. Always write domain files in English (they're read by the agent, not the user).

Topic files (`.socrates/domains/<domain>/<topic-slug>.md`) start with `# <Topic>` and use only the sections they need — usually Scaffolding levels, Exposing a wrong answer, Mini-examples, Typical thinking errors and Resources.

```markdown
# <Domain>

Domain guide for the Socratic method: <what it covers, comma-separated subtopics>.

## Target

<How you know the user got there in this domain. Closed (a correct result) or open (explain + apply to a new case + say when it fails)?>

## Anchors

<What "concrete" means here: a line of code, a sentence, a word in context, a real decision…>

- Bad: "<vague question>"
- Good: "<question quoting a concrete anchor>"

## Starting from zero

<How to begin when the user brings no material: what tiny example or situation to offer, what to ask first.>

## Scaffolding levels

Example: <a specific concept in this domain>.

| Level | Example                        |
| ----- | ------------------------------ |
| 1     | "<point at the area>"          |
| 2     | "<narrow to the element>"      |
| 3     | "<scenario to trace>"          |
| 4     | "<2–3 options, which and why>" |

## Exposing a wrong answer

<How to make a contradiction visible in this domain, with one example question.>

## Mini-examples

<Format and size of a mini-example here, then one worked example: the example, the predict question, and 2–4 follow-up questions ending with "where does this happen in your case?">

## Checking the answer

<How the user can verify on their own: run it, transfer to a new case, use it in a sentence, plug numbers in…>

## Typical thinking errors

- <common misconception and what it looks like>

## Resources

Only verified or user-provided links. Use them in the recap, never before or during the ladder.

- [<title>](url) — <why it's useful>
```
