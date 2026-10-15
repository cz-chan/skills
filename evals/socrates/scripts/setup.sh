#!/bin/sh
# Usage: scripts/setup.sh <empty-sandbox-dir>
# Builds the test project: local git repo (no remote), a small JS script, skill in .claude/skills.
# Installs nothing. Everything stays inside <sandbox-dir>.
set -e
EVALS="$(cd "$(dirname "$0")/.." && pwd)"
SKILL="$EVALS/../../skills/socrates"
SANDBOX="$1"
[ -n "$SANDBOX" ] || { echo "usage: $0 <empty-sandbox-dir>"; exit 1; }
mkdir -p "$SANDBOX" && cd "$SANDBOX"
[ -z "$(ls -A .)" ] || { echo "sandbox must be empty"; exit 1; }

git init -q
git config user.name "fixture" && git config user.email "fixture@local"
mkdir -p src .claude/skills runs
cp "$EVALS/fixtures/project-README.md" README.md
cp "$EVALS/fixtures/project-user.js" src/user.js
cp -r "$SKILL" .claude/skills/
cp "$EVALS/scripts/reset.sh" reset.sh && chmod +x reset.sh
printf 'runs/\n' > .gitignore
git add -A && git commit -qm "fixture: initial state" && git tag fixture-initial
echo "sandbox ready: $SANDBOX"
