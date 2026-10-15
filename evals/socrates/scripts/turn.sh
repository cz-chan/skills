#!/bin/sh
# Usage (inside the sandbox): <evals>/scripts/turn.sh <test-id> <n> "<message>" [session_id]
# One turn of a multi-turn test (S7, S9, S10, S4 turn 2). The learner is simulated by hand
# (S7 follows persona-S7.md). Transcripts go to runs/<test-id>-<n>.jsonl.
# Write/Edit rules use //<abs>/**: relative ./** breaks when the agent cd's into a subfolder.
# Bash rules match the command text, so they use the plain absolute path (single /), plus the
# relative form for when the agent runs from the sandbox root. mv/mkdir/rm only on .socrates/.
[ -n "$3" ] || { echo "usage: $0 <test-id> <n> \"<message>\" [session_id]" >&2; exit 1; }
if [ ! -x ./reset.sh ] || ! git rev-parse -q --verify refs/tags/fixture-initial >/dev/null 2>&1; then
  echo "turn.sh: run it from the root of a sandbox built by setup.sh. Nothing run." >&2
  exit 1
fi
P="$(pwd -P)"
D="/$P"
TOOLS="Skill,Read,Glob,Grep,Write($D/**),Edit($D/**),Bash(ls:*),Bash(git status),Bash(git log:*)"
for c in "mkdir $P/.socrates" "mkdir -p $P/.socrates" "mkdir .socrates" "mkdir -p .socrates" \
         "mv $P/.socrates/" "mv .socrates/" "rm $P/.socrates/" "rm .socrates/"; do
  TOOLS="$TOOLS,Bash($c*)"
done
if [ -n "$4" ]; then
  claude -p --resume "$4" "$3" --allowedTools "$TOOLS" --output-format stream-json --verbose > "runs/$1-$2.jsonl" 2> "runs/$1-$2.err"
else
  claude -p "$3" --allowedTools "$TOOLS" --output-format stream-json --verbose > "runs/$1-$2.jsonl" 2> "runs/$1-$2.err"
fi
node -e 'const l=require("fs").readFileSync(process.argv[1],"utf8").trim().split("\n");const r=JSON.parse(l[l.length-1]);console.log("SESSION",r.session_id,"cost",r.total_cost_usd)' "runs/$1-$2.jsonl"
