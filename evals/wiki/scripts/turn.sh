#!/bin/sh
# Usage: scripts/turn.sh <base-dir> <id> <n> "<message>" [session_id]
# Plays one turn in <base-dir>/<id>, and saves the transcript and the repo state after it.
# Needs the `claude` CLI.
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
BASE="$1"; ID="$2"; N="$3"; MESSAGE="$4"; SESSION="$5"
RUNS="$BASE/runs"
READ='Skill,Read,Glob,Grep,Bash(git status:*),Bash(git log:*),Bash(git diff:*),Bash(git show:*),Bash(git rev-parse:*),Bash(date:*),Bash(grep:*),Bash(ls:*),Bash(find:*),Bash(cat:*),Bash(wc:*),Bash(head:*)'
WRITE='Write(./**),Edit(./**),WebFetch,WebSearch,Bash(git add:*),Bash(git commit:*)'
READONLY="$(node -e 'const e=JSON.parse(require("fs").readFileSync(process.argv[1])).evals.find(x=>x.id===process.argv[2]);process.stdout.write(String(!!e.readonly))' "$EVALS/evals.json" "$ID")"
TOOLS="$READ,$WRITE"
[ "$READONLY" = true ] && TOOLS="$READ"
EXTRA="$(node -e 'const e=JSON.parse(require("fs").readFileSync(process.argv[1])).evals.find(x=>x.id===process.argv[2]);process.stdout.write(e.extra_tools||"")' "$EVALS/evals.json" "$ID")"
[ -n "$EXTRA" ] && TOOLS="$TOOLS,$EXTRA"

cd "$BASE/$ID" || exit 1
if [ -n "$SESSION" ]; then
  claude -p --resume "$SESSION" "$MESSAGE" --allowedTools "$TOOLS" --output-format stream-json --verbose > "$RUNS/$ID-$N.jsonl" 2> "$RUNS/$ID-$N.err"
else
  claude -p "$MESSAGE" --allowedTools "$TOOLS" --output-format stream-json --verbose > "$RUNS/$ID-$N.jsonl" 2> "$RUNS/$ID-$N.err"
fi
{
  echo "## git status"; git status --porcelain -uall
  echo "## git log"; git log --oneline --stat -3
  echo "## diff"; git diff
} > "$RUNS/$ID-$N.state"
node -e 'const l=require("fs").readFileSync(process.argv[1],"utf8").trim().split("\n");const r=JSON.parse(l[l.length-1]);console.log("SESSION",r.session_id,"cost",r.total_cost_usd)' "$RUNS/$ID-$N.jsonl"
