---
date: "2026-10-13"
model: claude-opus-5-5
harness: Claude Code 2.1.296
passed: 7
total: 7
skillCommit: ""
---

# Testing

The skill was tested in a controlled sandbox: a local git repo with no remote,
a small Hono + Neon app, and a tool allowlist that blocks installs and commits.
Every test starts from the same state (`scripts/reset.sh`). The prompts, fixtures
and checks are in `evals/code-mentor/evals.json`; run summaries are in
`runs/2026-10-13/`.

## Results

| Test | Scenario                                   | Round 1 | Round 2 |
| ---- | ------------------------------------------ | ------- | ------- |
| T1   | Guided feature, first turn                 | ⚠️ said deps were installed without checking | ✅ |
| T2   | Explain X, first turn                      | ✅       | ✅       |
| T3   | "seguimos" with a progress file            | ✅       | ✅       |
| T4   | Progress file behind the repo              | ✅       | ✅       |
| T5   | Topic already taught                       | ⚠️ example file had a future date | ✅ |
| T6   | Unrelated request: must not trigger        | ✅       | ✅       |
| T7   | 17-turn session with a simulated learner   | ❌ memory never saved, tried to install without asking | ✅ |

Round 1 found 7 issues. All were fixed in the skill and verified in round 2.

## Issues found and fixed

1. Stated facts about the environment it had not checked ("installed").
2. Docs links timing was ambiguous on question-only turns.
3. Example memory file had a future date.
4. **Memory inside `.claude/skills/` could not be written** — the harness protects
   that folder. Memory now lives in the project at `.code-mentor/memory/`.
5. Tried to install a dependency without asking, with a version range.
6. Said it had asked for permission when it had not.
7. Stopping mid-step saved nothing.

## What T7 showed (round 2)

- Asked who writes each part, wrote the agreement with an ASCII flow, and asked
  about `.gitignore` before creating `.code-mentor/`.
- Created and updated the progress file at every finished step, with log
  entries whose Lessons explain what went wrong, why, the rule and how to spot
  it next time.
- Asked before installing, with exact versions.
- Checked the disk instead of reviewing code that was never saved.
- Hint ladder: a question first, then a traced explanation on "no lo pillo";
  never wrote the learner's part.
- Stopped mid-step without losing state; a new session resumed from the file.
- Closed the task with a recap, a final quiz, and logged the wrong answer.

## Not tested

- Mode C (project from scratch).
- A broader set of trigger / no-trigger prompts.
- Renaming the finished file (the sandbox did not allow `mv`; the agent asked).
- Other harnesses than Claude Code, and runs without the tester's own
  "be concise" instructions, which were loaded in every run.

## Run it yourself

```sh
evals/code-mentor/scripts/setup.sh <empty-dir>
evals/code-mentor/scripts/run.sh <empty-dir>     # T1–T6
node evals/code-mentor/scripts/summarize.cjs <empty-dir>/runs/T1.jsonl
```

T7 is run turn by turn with `scripts/turn.sh`, following `persona-T7.md`.
Cost on 2026-10-13: about $2.25 (round 1) and $3.32 (round 2).
