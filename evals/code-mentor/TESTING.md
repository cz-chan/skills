---
date: "2026-11-04"
model: claude-opus-5-5
harness: Claude Code 2.1.317
passed: 19
total: 19
skillCommit: ""
---

# Testing

The skill was tested in a controlled sandbox: a local git repo with no remote,
a small Hono + Neon app, and a tool allowlist that blocks installs and commits.
Every test starts from the same state (`scripts/reset.sh`). The prompts, fixtures
and checks are in `evals/code-mentor/evals.json`; run summaries are in
`runs/<date>/`.

## Results

Grading was done by reading the transcripts against the checks in `evals.json`.

| Test | Scenario                                 | 10-13 R1 | 10-13 R2 | 11-03 R1 | 11-03 R2 | 11-03 R3 |
| ---- | ---------------------------------------- | -------- | -------- | -------- | -------- | -------- |
| T1   | Guided feature, first turn               | ⚠️       | ✅       | ✅       | ✅       | ✅       |
| T2   | Explain X, first turn                    | ✅       | ✅       | ✅       | ✅       | ✅       |
| T3   | "seguimos" with a progress file          | ✅       | ✅       | ✅       | ✅       | ✅       |
| T4   | Progress file behind the repo            | ✅       | ✅       | ✅       | ✅       | ✅       |
| T5   | Topic already taught                     | ⚠️       | ✅       | ✅       | ✅       | ✅       |
| T6   | Unrelated request: must not trigger      | ✅       | ✅       | ✅       | ✅       | ✅       |
| T7   | Long session with a simulated learner    | ❌       | ✅       | ❌       | ✅       | not rerun |
| T8   | Resume briefing, trainee, concise prompt | —        | —        | ✅       | ✅       | ✅       |
| T9   | Resume briefing, senior                  | —        | —        | ✅       | ❌       | ✅ (3/3) |

T7 last ran in 11-03 R2. R3 only added one sentence to the resume briefing (ask
if it is clear last, at every level), so T7 was not repeated; T3, T4, T8 and T9
cover that sentence. T9 ran three times in R3 because it gave different results
in R1 and R2.

After R3, `SKILL.md` was trimmed without changing its rules: repeated rules were
merged and section links became plain text.

On 2026-11-04, mode C (project from scratch) was removed: planning a whole product
goes to a separate skill. These scope tests ran on the final version:

| Test | Scenario                                         | Result |
| ---- | ------------------------------------------------ | ------ |
| T10  | Learn by building something new: uses mode A     | ✅     |
| T11  | One feature from a product's `PLAN.md`           | ✅     |
| T12  | Product request, no wish to learn: not triggered | ✅     |

Later on 2026-11-04, memory files moved to English, while replies stay in the user's
language. The progress fixtures moved to English too. These tests ran on that version
(round 3), with final files saved next to the transcripts:

| Test | Scenario                                         | Result |
| ---- | ------------------------------------------------ | ------ |
| T3   | English progress file, reply in Spanish          | ✅     |
| T13  | New progress file in English, reply in Spanish   | ✅     |
| T14  | Older Spanish file: new content in English only  | ✅     |
| T15  | Reads English lessons back in Spanish            | ✅     |

T15 ran with read-only tools, so its "changes no file" check could not fail.

Being stuck stopped leading to the solution: only asking for it does, and the solution
comes with why, how it works and how it connects to the rest. T17 is from round 4; T16
failed there and passed in round 5, after the fix in issue 12:

| Test | Scenario                                           | R4 | R5        |
| ---- | -------------------------------------------------- | -- | --------- |
| T16  | Stuck three times, then "dime la solución"         | ❌ | ✅        |
| T17  | "házmelo": solution right away, with the why       | ✅ | not rerun |

Then only the user could change the project's code: the agent shows code in the console
and writes it only when asked. T16 did not run with this rule; its first run had created
`db/schema.sql` without being asked, which motivated it. T17 was repeated (round 7):

| Test | Scenario                                                 | Result |
| ---- | -------------------------------------------------------- | ------ |
| T17  | "házmelo": writes the file, with the why                 | ✅     |
| T18  | Asks for the agent's part: code only in the console      | ✅     |
| T19  | "dame la solución" in the console, then "escríbela tú"   | ✅     |

In T17 the agent chose an open design decision itself, and said so.

### Final round (2026-11-04, round 8)

All 19 tests ran again on the final `SKILL.md`, and all passed. Transcripts and final memory
files are in `runs/2026-11-04/round-8/`.

- The first attempt hit a usage limit. T5, T14, T15, T17 and T19 were repeated on the same
  version, and T7 went on in its session.
- That limit left two failed turns in T7's history, including a "no lo pillo". The agent
  answered it on the next turn with a new traced example and no core code. The persona's
  planned "no lo pillo" came later, on the hardcoded URL, and went the same way.
- In T7, the learner wrote the schema, queries and connection. The agent gave the route and
  the button in the console, and changed only `.gitignore` as agreed, and `.code-mentor/`.
- In T7, the agent could not rename the finished file (no `mv` allowed), and gave the command.

## Issues found and fixed

Found on 2026-10-13:

1. Stated facts about the environment it had not checked ("installed").
2. Docs links timing was ambiguous on question-only turns.
3. Example memory file had a future date.
4. **Memory inside `.claude/skills/` could not be written** — the harness protects
   that folder. Memory now lives in the project at `.code-mentor/memory/`.
5. Tried to install a dependency without asking, with a version range.
6. Said it had asked for permission when it had not.
7. Stopping mid-step saved nothing.

Found on 2026-11-03:

8. **Resuming a session was too vague for a learner.** The skill asked for "two
   lines" and `## Current step` kept only the next action. Found in real use, not
   by a test. Now there is a resume briefing, and the file keeps the problem and
   the why.
9. **One "no lo pillo" handed over the core code.** The stuck rule jumped to hint 5
   if the idea had already been explained. Now it explains another way first; hint
   5 comes only if they are still stuck.
10. **The senior briefing could end without asking if it was clear.** A question
    about the repo mismatch took its place. Now that question always comes last.

Found on 2026-11-04:

11. **"No sé hacerlo" could end in the solution.** Found in real use. Staying stuck
    led to hint 5, which replaces the rule in issue 9. Now only asking for it does, and
    every hint says why.
12. **A template to paste and rename was nearly the solution.** T16 asked to paste
    another table and change two words. Now a pattern must come from another problem,
    with nothing to paste and rename.
13. **The agent changed project code without being asked.** Found in real use. It
    wrote the parts outside the core to the project's files. Now it shows them in the
    console with their explanation, and writes only on an explicit request.

## What T7 showed (2026-11-03, round 2)

- Recorded "con detalle y ejemplos" as `Explanations:` in `## Agreement`.
- `## Current step` kept the problem and the why at every checkpoint.
- On the hardcoded URL, explained both consequences and did not rewrite the line.
- On "no lo pillo", gave a new traced example and no core code.
- Stopped mid-step without losing state. A new session gave the full briefing:
  whole picture, problem, idea, why, what it gives, how.
- On "no lo he entendido", explained it with a new example and asked again. On
  "ahora sí, empecemos", gave the first instruction.
- Closed the task with a recap and a final quiz, and logged the wrong answer.

## Not tested

- Learning from a `PLAN.md` beyond the first turn: T11 stops before any code, so a
  resume briefing that places the feature in the plan is untested.
- The mid level of the resume briefing.
- Offering a temporary HTML page when ASCII is not enough.
- A broader set of trigger / no-trigger prompts.
- Renaming the finished file (the sandbox did not allow `mv`; the agent asked).
- Installing with exact versions in the 11-03 runs: the agent said it would ask,
  but the session never reached an install.
- Done checks in T7: there is no Neon or dependencies in the sandbox, so the agent
  reviewed the code by reading it.
- Other harnesses than Claude Code. All runs load the tester's own "be concise"
  instructions; T8 adds one explicitly.

The fixture's progress file claims work that is not in the sandbox repo, so T3, T4,
T8 and T9 also report that mismatch. It makes those briefings longer than they would
be in a matching repo, especially for the senior.

## Run it yourself

```sh
evals/code-mentor/scripts/setup.sh <empty-dir>
evals/code-mentor/scripts/run.sh <empty-dir>         # T1–T6
evals/code-mentor/scripts/run-resume.sh <empty-dir>  # T8, T9
evals/code-mentor/scripts/run-scope.sh <empty-dir>   # T10–T12
evals/code-mentor/scripts/run-language.sh <empty-dir>  # T3, T13–T15
evals/code-mentor/scripts/run-solution.sh <empty-dir>  # T16, T17
evals/code-mentor/scripts/run-console.sh <empty-dir>   # T18, T19
node evals/code-mentor/scripts/summarize.cjs <empty-dir>/runs/T1.jsonl
```

T7 is run turn by turn with `scripts/turn.sh`, following `persona-T7.md`.

The final round cost $12.10, with T7 at $3.50. Cost per full round before that: about $2.25 and $3.32 on 2026-10-13; $4.51 and $5.91 on
2026-11-03, with T7 included. Round 3 (no T7, T9 three times) cost $3.36. The scope
tests cost $1.20, the language tests $1.79 the T16 and T17 runs $3.35 and T18 and T19 $1.50 on 2026-11-04.

`total_cost_usd` is cumulative across `--resume`: to get a session's cost, take its last
turn, do not add up the turns. Older figures may be too high for this reason.
