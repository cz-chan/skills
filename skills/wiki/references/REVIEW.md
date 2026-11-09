# Review

Follow these steps once the user has asked whether the wiki is up to date.

1. For each layer file with `code` and `reviewed`, run `git log <reviewed>.. -- <paths>`.
   Read what changed, and report which files no longer match.
2. List decisions no layer links to, current decisions whose `code` no longer exists,
   open `Assumption:` lines, unfinished old files in `work/`, any `description` that no
   longer matches its file, and current decisions with overlapping `code` that contradict
   each other.
3. Ask which ones to fix, and work through them with the steps in `SKILL.md`. Update
   `reviewed` only for files you actually checked, and say which.
