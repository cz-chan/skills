#!/bin/sh
# Usage: scripts/run-console.sh <sandbox-dir>
# Runs T18 and T19 (see evals.json): only the user touches the code. Saves transcripts in <sandbox>/runs/,
# the files changed after each turn, and the final diff. The agent can write inside the sandbox.
# Needs the `claude` CLI.
set -e
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
cd "$1"
M=.code-mentor/memory
TOOLS='Skill,Read,Glob,Grep,Bash(git status),Bash(git log:*),Bash(git diff:*),Write(./**),Edit(./**)'

session() { # <transcript>
  node -e 'const l=require("fs").readFileSync(process.argv[1],"utf8").trim().split("\n");console.log(JSON.parse(l[l.length-1]).session_id)' "$1"
}
turns() { # <test> <message>...
  T="$1"; shift; N=1; SID=""
  for MSG in "$@"; do
    if [ -n "$SID" ]; then
      claude -p --resume "$SID" "$MSG" --allowedTools "$TOOLS" --output-format stream-json --verbose > "runs/$T-$N.jsonl" 2> "runs/$T-$N.err"
    else
      claude -p "$MSG" --allowedTools "$TOOLS" --output-format stream-json --verbose > "runs/$T-$N.jsonl" 2> "runs/$T-$N.err"
    fi
    SID="$(session "runs/$T-$N.jsonl")"
    git status --short --untracked-files=all > "runs/$T-$N-status.log"
    N=$((N + 1))
  done
  git add -A && git diff --cached > "runs/$T-final.diff"
  echo "$T done"
}

./reset.sh
turns T18 \
  "quiero hacer un botón de likes con Neon para aprender bases de datos. soy principiante: yo escribo el esquema y las queries y tú el resto. explícamelo con detalle y con ejemplos. cuando pulse el botón, el contador debe subir y mantenerse al recargar" \
  "sí, de acuerdo, y añade .code-mentor al .gitignore" \
  "ya tengo el proyecto de Neon y el .env. dame ya tu parte de la ruta /api/likes"

./reset.sh
mkdir -p $M/databases
sed "s/^level: .*/level: junior/" "$EVALS/fixtures/neon-likes-progress.md" > $M/databases/0001-neon-likes-progress.md
git add -A
git commit -qm "wip likes"
turns T19 \
  "continuemos" \
  "sí, empecemos. el código de los pasos 1 y 2 está en otra máquina, tú céntrate en la tabla" \
  "dame la solución" \
  "escríbela tú en db/schema.sql"

./reset.sh
echo "Summaries: node $EVALS/scripts/summarize.cjs runs/T18-1.jsonl"
