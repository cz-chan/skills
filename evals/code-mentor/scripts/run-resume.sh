#!/bin/sh
# Usage: scripts/run-resume.sh <sandbox-dir>
# Runs the resume briefing tests T8 and T9 (see evals.json) and saves transcripts in <sandbox>/runs/.
# Needs the `claude` CLI. Tools are read-only: the agent cannot write, install or commit.
set -e
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
cd "$1"
M=.code-mentor/memory
RO='Skill,Read,Glob,Grep,Bash(git status),Bash(git log:*)'
CONCISE='When reporting information, be extremely concise and sacrifice grammar, if necessary, for the sake of concision.'

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

fixture trainee
claude -p "continuemos" --append-system-prompt "$CONCISE" --allowedTools "$RO" --output-format stream-json --verbose > runs/T8-1.jsonl 2> runs/T8-1.err
SID="$(session runs/T8-1.jsonl)"
claude -p --resume "$SID" "no lo he entendido, explícamelo mejor" --append-system-prompt "$CONCISE" --allowedTools "$RO" --output-format stream-json --verbose > runs/T8-2.jsonl 2> runs/T8-2.err
SID="$(session runs/T8-2.jsonl)"
claude -p --resume "$SID" "ahora sí, empecemos" --append-system-prompt "$CONCISE" --allowedTools "$RO" --output-format stream-json --verbose > runs/T8-3.jsonl 2> runs/T8-3.err
echo "T8 done"

fixture senior
claude -p "continuemos" --allowedTools "$RO" --output-format stream-json --verbose > runs/T9.jsonl 2> runs/T9.err
echo "T9 done"

./reset.sh
echo "Summaries: node $EVALS/scripts/summarize.cjs runs/T8-1.jsonl"
