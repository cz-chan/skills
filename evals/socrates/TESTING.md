---
date: "2026-10-15"
model: claude-opus-5-5
harness: Claude Code 2.1.300
passed: 10
total: 12
pending: 2 # S11, S12 not run yet
skillCommit: ""
---

# Testing

The skill was tested in a controlled sandbox: a local git repo with no remote,
one JS file with an async bug (`src/user.js`), and a tool allowlist that blocks
installs and commits. Every test starts from the same state (`scripts/reset.sh`).
The prompts, fixtures and checks are in `evals/socrates/evals.json`; run
summaries are in `runs/2026-10-15/`.

## Results

| Test | Scenario                                         | Round 1 | Round 2 | Round 3 | Round 4 | Round 5 |
| ---- | ------------------------------------------------ | ------- | ------- | ------- | ------- | ------- |
| S1   | Code material, first turn                        | ✅       | ✅       | — | — | — |
| S2   | From zero, no domain guide                       | ✅       | ✅       | — | — | — |
| S3   | Resume an interrupted session (note in English)  | ✅       | ✅       | — | — | — |
| S4   | Topic already learned + user domain guide        | ✅       | ✅ (2 turns) | — | — | — |
| S5   | User domain guide in `.socrates/domains/`        | ✅       | ✅       | — | — | — |
| S6   | No Socrates mention: must not trigger            | ✅       | ✅       | — | — | — |
| S7   | 13-turn session with a simulated learner         | ✅       | ⚠️ old `-progress` note left behind | ✅ | ✅ (turns 8–11) | ✅ (turns 8–13) |
| S8   | Two interrupted sessions                         | —       | ✅       | — | — | — |
| S9   | Learner declines creating `.socrates/`           | —       | ✅       | — | — | — |
| S10  | Improve an existing guide                        | —       | ⚠️ old `-progress` note left behind | ✅ | — | — |
| S11  | Trigger: "socrática" (Spanish adjective)         | —       | —       | — | — | — |
| S12  | Trigger: "Sócrates" (accented name)              | —       | —       | — | — | — |

**Pending re-run.** All results above predate the 2026-10-15 SKILL.md changes: wrong answers now drop a level with a counter-question (mini-example on the second failure), level-4 floor → offer the answer, single closing message with folder consent, English section headings in saved notes, trigger in any language. S11–S12 are new.

## What S7 showed

- One anchored question per turn; never stated the answer.
- Wrong answer ("`async` changes nothing") → mini-example to predict
  (`async function cinco() { return 5 }`).
- "dímelo ya" (first ask) → one line of encouragement and a level-4 question
  with options.
- Wrong answer ("`res` is already the JSON") → exposed the contradiction with
  the code itself: "then why call `res.json()`?".
- On a mid-ladder stop, asked to create `.socrates/` and said why not `.claude/`;
  saved a `-progress.md` note with the summary, target, conclusions and errors —
  no remaining ladder steps.
- A new session resumed from the note with the summary in Spanish.
- At the end: asked for the final explanation, showed the recap, saved the note
  without asking again and renamed it with the date, offered the next topic and
  a domain guide in one closing message.
- Wrote the guide to `.socrates/domains/code.md` plus a topic file
  `code/async-promises.md`, in English. Nothing written to `.claude/`.

## Minor observations (not failures)

- S2: confirmed the target and asked the first question in the same message,
  and that question bundled two ("what are those 10 €, and why?").
- S4: cited the previous session by date, not by path. "Tests the old thinking
  error early" could not be checked: a single turn ends at the target summary.
- S7 turn 3: went straight to a mini-example on the first wrong answer instead
  of a contradiction question first.
- S7 turn 11: said "Funciona" based on the learner's report, without reading
  the file.

## Round 2 (same day)

Re-ran S1–S7 and added S8–S10 for what round 1 did not cover.

- S4 turn 2: the first question was a mini-example that tests the old error
  (`console.log(main())` where `main` is `async`).
- S8: listed both interrupted sessions with topic, date and what was pending,
  and asked which one to resume. No ladder question yet.
- S9: on "no", wrote nothing; when the learner came back and stopped again in
  the same session, did not ask again and said nothing was saved.
- S10: resumed, reached the target, proposed 3 additions saying where each
  goes, applied only the 2 accepted ones to `.socrates/domains/code.md`
  (74 lines, English). Did not offer a new guide.

### Issues found

1. **Finishing a note left the `-progress.md` file behind** (S7, S10). Round 1
   renamed it with `mv`; round 2 wrote a new file and tried `rm` on the old
   one, which the sandbox blocked. Next session would offer a finished topic as
   pending. Fix: `session-notes.md` now says to rename with `mv`, never write a
   new file and delete the old one.
2. S7 recap left out the "Questions that got you there" section.
3. Harness: `Write(./**)` stopped matching after the agent `cd`'d into a
   subfolder. `turn.sh` now uses absolute path rules.

## Round 3 (same day)

Re-ran only what failed in round 2, after the `mv` fix in `session-notes.md`.
S7 started from the interrupted note round 2 left (`fixtures/async-promises-progress.md`),
so only turns 8–13 ran.

- S7 and S10: renamed the note with `mv`, then rewrote it. No `-progress.md`
  left behind. The recap had all its sections.
- S10: proposed 2 additions (not 3); when the learner said "1 and 2, not 3",
  it applied both and said there was no third one.
- S7 turn 11: after "it works now", went straight to the recap without first
  asking for the final explanation in the learner's own words (rounds 1–2 did
  ask). Minor.

## Round 4 (same day)

Added to SKILL.md "Ending the session": never skip the final explanation, even
if the code already works. Re-ran S7 turns 8–11 from the same interrupted note:
after "it works now", it asked for the explanation in the learner's own words
before any recap. ✅

## Round 5 (same day)

SKILL.md now lets the learner skip the final explanation: one line on why it's
worth it, no insisting, then respect the answer. Re-ran S7 turns 8–13: on
"prefiero no explicarlo", it gave one line ("explaining it yourself is what
makes it stick, and it's two sentences") and asked once; on "no, de verdad",
it said "Respetado" and went on to the recap and the saved note. ✅

## Not tested

- Trigger prompts in other languages than Spanish and English (S11–S12 cover Spanish only).
- Other harnesses than Claude Code, and runs without the tester's own
  "be concise" instructions, which were loaded in every run.

## Run it yourself

```sh
evals/socrates/scripts/setup.sh <empty-dir>
evals/socrates/scripts/run.sh <empty-dir>     # S1–S6, S8, S11, S12, in parallel
node evals/socrates/scripts/summarize.cjs <empty-dir>/runs/S1.jsonl
```

S7, S9, S10 and S4 turn 2 are run turn by turn with `scripts/turn.sh <id> <n> "<message>" [session]`; S7 follows `persona-S7.md`.
Cost on 2026-10-15: about $4.50 (round 1), $8.10 (round 2), $3.80 (round 3), $1.00 (round 4) and $1.70 (round 5).
