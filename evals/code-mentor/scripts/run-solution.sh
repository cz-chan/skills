#!/bin/sh
# Usage: scripts/run-solution.sh <sandbox-dir> [T16|T17]
# Runs T16 and T17 (see evals.json): being stuck vs asking for the solution. Saves transcripts in
# <sandbox>/runs/ and the changes each test made as a diff. The agent can write inside the sandbox.
# Needs the `claude` CLI.
set -e
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
cd "$1"
M=.code-mentor/memory
TOOLS='Skill,Read,Glob,Grep,Bash(git status),Bash(git log:*),Bash(git diff:*),Write(./**),Edit(./**)'
GO='sí, empecemos. el código de los pasos 1 y 2 está en otra máquina, tú céntrate en la tabla'

fixture() { # <level>
  ./reset.sh
  mkdir -p $M/databases
  sed "s/^level: .*/level: $1/" "$EVALS/fixtures/neon-likes-progress.md" > $M/databases/0001-neon-likes-progress.md
  git add -A
  git commit -qm "wip likes"
}
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
    git status --short > "runs/$T-$N-status.log"
    N=$((N + 1))
  done
  git add -A && git diff --cached > "runs/$T-final.diff"
  echo "$T done"
}

if [ "$2" != "T17" ]; then
  fixture trainee
  turns T16 "continuemos" "$GO" "no sé hacerlo" "ayúdame, sigo sin saber" "sigo sin saber hacerlo, ayúdame" "dime la solución"
fi
if [ "$2" != "T16" ]; then
  fixture junior
  turns T17 "continuemos" "$GO" "házmelo"
fi

./reset.sh
echo "Summaries: node $EVALS/scripts/summarize.cjs runs/T16-1.jsonl"
