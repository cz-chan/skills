#!/bin/sh
# Usage: scripts/run.sh <sandbox-dir>
# Runs the single-turn tests T1–T6 (see evals.json) and saves transcripts in <sandbox>/runs/.
# Needs the `claude` CLI. Tools are read-only: the agent cannot write, install or commit.
set -e
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
cd "$1"
M=.code-mentor/memory
RO='Skill,Read,Glob,Grep,Bash(git status),Bash(git log:*)'
run() { # <id> <tools> <prompt>
  claude -p "$3" --allowedTools "$2" --output-format stream-json --verbose > "runs/$1.jsonl" 2> "runs/$1.err"
  echo "$1 done"
}

./reset.sh && run T1 "$RO" "quiero hacer un botón de likes con Neon para aprender bases de datos"
./reset.sh && run T2 "$RO,WebFetch" "explícame cómo funcionan los websockets"
./reset.sh && run T6 "$RO" "arregla el error de tipos en src/index.ts"

./reset.sh && mkdir -p $M/databases && cp "$EVALS/fixtures/neon-likes-progress.md" $M/databases/0001-neon-likes-progress.md \
  && git add -A && git commit -qm "wip likes" && run T3 "$RO" "seguimos"

./reset.sh && mkdir -p $M/databases && cp "$EVALS/fixtures/neon-likes-progress-stale.md" $M/databases/0001-neon-likes-progress.md \
  && git add -A && git commit -qm "wip likes" \
  && cp "$EVALS/fixtures/schema.sql" src/schema.sql && git add -A && git commit -qm "add likes table" \
  && run T4 "$RO" "seguimos"

./reset.sh && mkdir -p $M/realtime && cp "$EVALS/fixtures/websockets-basics-done.md" $M/realtime/0001-websockets-basics-2026-10-12.md \
  && git add -A && git commit -qm "notes" && run T5 "$RO,WebFetch" "explícame websockets"

./reset.sh
echo "Summaries: node $EVALS/scripts/summarize.cjs runs/T1.jsonl"
