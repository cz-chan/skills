#!/bin/sh
# Usage: scripts/run-scope.sh <sandbox-dir>
# Runs the scope tests T10–T12 (see evals.json) and saves transcripts in <sandbox>/runs/.
# Needs the `claude` CLI. Tools are read-only: the agent cannot write, install or commit.
set -e
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
cd "$1"
RO='Skill,Read,Glob,Grep,Bash(git status),Bash(git log:*)'
run() { # <id> <prompt>
  claude -p "$2" --allowedTools "$RO" --output-format stream-json --verbose > "runs/$1.jsonl" 2> "runs/$1.err"
  echo "$1 done"
}
plan() {
  ./reset.sh
  cp "$EVALS/fixtures/product-PLAN.md" PLAN.md
  git add -A
  git commit -qm "plan"
}

./reset.sh
run T10 "quiero aprender cómo funciona Redis por dentro construyendo uno desde cero"
plan
run T11 "quiero hacer la primera función de PLAN.md para aprender bases de datos"
plan
run T12 "hazme este producto siguiendo PLAN.md"
./reset.sh
