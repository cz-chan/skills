#!/bin/sh
# Usage (inside the sandbox): <evals>/scripts/turn.sh <n> "<message>" [session_id]
# One turn of the multi-turn test T7. The learner is simulated by hand
# following persona-T7.md; the learner's code is edited between turns.
TOOLS='Skill,Read,Glob,Grep,WebFetch,Write(./**),Edit(./**),Bash(git status),Bash(git log:*),Bash(git diff:*)'
if [ -n "$3" ]; then
  claude -p --resume "$3" "$2" --allowedTools "$TOOLS" --output-format stream-json --verbose > "runs/T7-$1.jsonl" 2> "runs/T7-$1.err"
else
  claude -p "$2" --allowedTools "$TOOLS" --output-format stream-json --verbose > "runs/T7-$1.jsonl" 2> "runs/T7-$1.err"
fi
node -e 'const l=require("fs").readFileSync(process.argv[1],"utf8").trim().split("\n");const r=JSON.parse(l[l.length-1]);console.log("SESSION",r.session_id,"cost",r.total_cost_usd)' "runs/T7-$1.jsonl"
