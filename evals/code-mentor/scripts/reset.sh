#!/bin/sh
# Copied into the sandbox by setup.sh. Back to the initial commit, no memory.
# Refuses to run anywhere else: it discards uncommitted work.
set -e
cd "$(dirname "$0")"
if ! git rev-parse -q --verify refs/tags/fixture-initial >/dev/null || [ ! -f .claude/skills/code-mentor/SKILL.md ]; then
  echo "reset.sh: not a code-mentor sandbox (run scripts/setup.sh first). Nothing changed." >&2
  exit 1
fi
git reset --hard fixture-initial -q
git clean -fdq
rm -rf .code-mentor
