---
date: "2026-11-04"
model: claude-opus-5-5
harness: Claude Code 2.1.317
passed: 12
total: 12
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

T1–T9 were not repeated after the trim or the removal.

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
node evals/code-mentor/scripts/summarize.cjs <empty-dir>/runs/T1.jsonl
```

T7 is run turn by turn with `scripts/turn.sh`, following `persona-T7.md`.

Cost per full round: about $2.25 and $3.32 on 2026-10-13; $4.51 and $5.91 on
2026-11-03, with T7 included. Round 3 (no T7, T9 three times) cost $3.36. The scope
tests cost $1.20 on 2026-11-04.
