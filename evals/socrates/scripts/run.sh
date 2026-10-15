#!/bin/sh
# Usage: scripts/run.sh <sandbox-dir>
# Runs the single-turn tests S1–S6, S8, S11 and S12 (see evals.json) in parallel and saves transcripts in <sandbox>/runs/.
# Each test gets its own copy of the sandbox (<sandbox>.S1, …) so they can run at the same time.
# Needs the `claude` CLI. Tools are read-only: the agent cannot write, delete, install or commit (no `find`: -delete/-exec; Glob covers it).
set -e
[ -n "$1" ] && [ -x "$1/reset.sh" ] || { echo "usage: $0 <sandbox-dir> (built by scripts/setup.sh)" >&2; exit 1; }
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
SB="$(cd "$1" && pwd)"
RO='Skill,Read,Glob,Grep,Bash(ls:*),Bash(cat:*),Bash(git status),Bash(git log:*)'
prep() { # <id> → fresh copy of the sandbox at <sandbox>.<id>, next to it (not inside, so skills don't nest)
  rm -rf "$SB.$1" && cp -R "$SB" "$SB.$1" && rm -rf "$SB.$1/runs" && (cd "$SB.$1" && ./reset.sh)
}
run() { # <id> <prompt>
  (cd "$SB.$1" && claude -p "$2" --allowedTools "$RO" --output-format stream-json --verbose > "$SB/runs/$1.jsonl" 2> "$SB/runs/$1.err"; echo "$1 done") &
}
note() { # <id> <fixture> <path inside .socrates>
  mkdir -p "$SB.$1/.socrates/$(dirname "$3")" && cp "$EVALS/fixtures/$2" "$SB.$1/.socrates/$3"
}

prep S1 && run S1 "Socratic: no entiendo por qué src/user.js imprime Promise { <pending> } en vez del usuario"
prep S2 && run S2 "Quiero aprender cómo funciona el interés compuesto, en modo Socrates. No sé nada de finanzas."
prep S3 && note S3 compound-interest-progress.md notes/finance/001-compound-interest-progress.md \
  && run S3 "socrates, seguimos con lo que dejamos"
prep S4 && note S4 async-promises-done.md notes/code/001-async-promises-2026-10-14.md \
  && note S4 domain-code.md domains/code.md \
  && run S4 "Socratic: quiero entender bien async/await en JavaScript"
prep S5 && note S5 domain-code.md domains/code.md \
  && run S5 "Socratic: no entiendo por qué src/user.js imprime Promise { <pending> } en vez del usuario"
prep S8 && note S8 compound-interest-progress.md notes/finance/001-compound-interest-progress.md \
  && note S8 fetch-errors-progress.md notes/code/001-fetch-errors-progress.md \
  && run S8 "socrates, seguimos"
prep S6 && run S6 "explícame por qué src/user.js imprime Promise { <pending> }"
prep S11 && run S11 "Ayúdame de forma socrática a entender por qué src/user.js imprime Promise { <pending> }"
prep S12 && run S12 "Enséñame interés compuesto como lo haría Sócrates"
wait
echo "Summaries: node $EVALS/scripts/summarize.cjs $SB/runs/S1.jsonl"
