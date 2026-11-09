# Session hook

The user has said yes to the hook. It runs one command from the repo root when a session
opens, and its output has to reach the agent:

```sh
cat .wiki/index.md; grep -rlE 'status: (in-progress|blocked)' .wiki/work; git log --oneline --remotes --not HEAD -- .wiki/
```

1. Work out which tool the user is working in. If it is not clear, ask. If the project
   uses more than one, do this for each.
2. Check that tool's official docs for how to run a command when a session opens. Do not
   rely on memory, because these settings change between tools and versions.
3. If the tool supports it, add the command to the project's configuration for that tool,
   keeping everything already there, and tell the user what you changed.
4. If it does not, tell the user and change nothing. The line in the agent instructions
   file still points agents to the wiki.
