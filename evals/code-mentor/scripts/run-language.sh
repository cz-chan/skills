#!/bin/sh
# Usage: scripts/run-language.sh <sandbox-dir>
# Runs the memory language tests T3 and T13–T15 (see evals.json) and saves transcripts in
# <sandbox>/runs/. T13 and T14 can write inside the sandbox; the final memory file is saved
# next to the transcripts. Needs the `claude` CLI.
set -e
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
cd "$1"
M=.code-mentor/memory
F=$M/databases/0001-neon-likes-progress.md
RO='Skill,Read,Glob,Grep,Bash(git status),Bash(git log:*)'
RW="$RO,Bash(git diff:*),Write(./**),Edit(./**)"

fixture() { # <file>
  ./reset.sh
  mkdir -p $M/databases
  cp "$EVALS/fixtures/$1" $F
  git add -A
  git commit -qm "wip likes"
}
session() { # <transcript>
  node -e 'const l=require("fs").readFileSync(process.argv[1],"utf8").trim().split("\n");console.log(JSON.parse(l[l.length-1]).session_id)' "$1"
}
turn() { # <name> <tools> <message> [session]
  if [ -n "$4" ]; then
    claude -p --resume "$4" "$3" --allowedTools "$2" --output-format stream-json --verbose > "runs/$1.jsonl" 2> "runs/$1.err"
  else
    claude -p "$3" --allowedTools "$2" --output-format stream-json --verbose > "runs/$1.jsonl" 2> "runs/$1.err"
  fi
}

fixture neon-likes-progress.md
turn T3 "$RO" "seguimos"
echo "T3 done"

./reset.sh
turn T13-1 "$RW" "quiero hacer un botón de likes con Neon para aprender bases de datos. soy principiante: yo escribo el esquema y las queries y tú el resto. explícamelo con detalle y con ejemplos. cuando pulse el botón, el contador debe subir y mantenerse al recargar"
SID="$(session runs/T13-1.jsonl)"
turn T13-2 "$RW" "sí, de acuerdo, y añade .code-mentor al .gitignore" "$SID"
if ! find $M -name '*-progress.md' 2>/dev/null | grep -q .; then
  SID="$(session runs/T13-2.jsonl)"
  turn T13-3 "$RW" "sí, créalo" "$SID"
fi
find $M -name '*-progress.md' -exec cp {} runs/T13-final-file.md \; 2>/dev/null || true
echo "T13 done"

fixture neon-likes-progress-es.md
turn T14-1 "$RW" "continuemos"
SID="$(session runs/T14-1.jsonl)"
turn T14-2 "$RW" "al final lo dejo por hoy, ya he decidido que las columnas son post_id, user_id y created_at. guarda dónde estamos" "$SID"
cp $F runs/T14-final-file.md
echo "T14 done"

fixture neon-likes-progress.md
turn T15 "$RO" "léeme lo que he aprendido hasta ahora en la tarea de los likes"
echo "T15 done"

./reset.sh
echo "Summaries: node $EVALS/scripts/summarize.cjs runs/T3.jsonl"
