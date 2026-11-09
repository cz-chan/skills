#!/bin/sh
# Usage: scripts/run-case.sh <base-dir> <id>
# Builds <base-dir>/<id> and plays the turns from evals.json. Results go to <base-dir>/runs/.
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
BASE="$1"
ID="$2"
field() { node -e 'const e=JSON.parse(require("fs").readFileSync(process.argv[1])).evals.find(x=>x.id===process.argv[2]);const v=eval("e."+process.argv[3]);process.stdout.write(v===undefined?"":String(v))' "$EVALS/evals.json" "$ID" "$1"; }

mkdir -p "$BASE/runs"
sh "$EVALS/scripts/setup.sh" "$BASE/$ID" "$(field state)" || exit 1

COUNT="$(field turns.length)"
SESSION=""
i=0
while [ "$i" -lt "$COUNT" ]; do
  OUT="$(sh "$EVALS/scripts/turn.sh" "$BASE" "$ID" "$((i + 1))" "$(field "turns[$i]")" "$SESSION")"
  SESSION="$(printf '%s\n' "$OUT" | sed -n 's/^SESSION //p' | cut -d' ' -f1)"
  i=$((i + 1))
done
node "$EVALS/scripts/summarize.cjs" "$BASE/runs" "$ID" "$BASE/summaries"
echo "$ID done"
