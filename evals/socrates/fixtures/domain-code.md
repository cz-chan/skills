# Code

Domain guide for the Socratic method: programming, debugging, reading codebases, configs.

## Target

Usually closed: the bug is found and the user can say why it happens, or they can predict what a piece of code does. For concepts (closures, async, recursion…), open: they can explain it, use it in new code, and say when it breaks.

## Anchors

A specific line, function, variable, value, error message, test, or program output. Quote it with its line number.

- Bad: "What do you think `fetchData` does?"
- Good: "Look at line 12: `const res = await fetch(url)`. What type of value do you think `res` holds right after that line?"

## Starting from zero

No code to anchor on yet. Write a tiny program (3–6 lines) that shows the concept working, and ask the user to predict what it does before running it. Start from something they already do by hand: repeating a step (loops), following a recipe (functions), deciding based on a condition (if/else).

- "Here's a list of 3 prices. Before running it, what do you think this loop prints, line by line?"

## Scaffolding levels

| Level | Example                                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------------------- |
| 1     | "Look at the `catch` block in `loadUser`. What happens to the error there?"                                 |
| 2     | "Focus on line 34, `console.log(e)`. After it runs, what does the function return?"                         |
| 3     | "Imagine the API returns 500. Walk me through each line that runs — where does it end?"                     |
| 4     | "After that `catch`, the caller gets: (a) the error, (b) `undefined`, (c) an empty object. Which, and why?" |

## Exposing a wrong answer

Use the code itself to show the contradiction: "If `res` were the JSON already, what would line 13 `res.json()` be doing?"

## Mini-examples

3–6 lines, runnable, in the user's language/runtime. Ask them to predict the output before running it.

Example — user doesn't see that their function is missing a `return`:

```js
function double(n) {
	n * 2;
}
const result = double(5);
console.log(result + 1);
```

- "Before running it, what do you think `console.log` prints?"
- (after running it: `NaN`) "Why isn't it `11`? What value did `result` actually receive?"
- "What would happen if another function used `result` to calculate a price?"
- "Now look at your `calculateTotal` — what does it have in common with `double`?"

Never narrate the lesson ("see? without `return` it returns nothing").

## Checking the answer

The user can verify by running it: a print, a test, a debugger breakpoint. Prefer "run it and tell me what you see" over your confirmation.

## Typical thinking errors

- Assuming a value's type or shape without checking it (`res` is JSON, the array is never empty).
- Confusing printing with returning (`console.log` vs `return`).
- Reading code in written order instead of execution order (async, callbacks, early returns).
- Assuming the error is where it surfaces, not where it originates.
- "It works on my input" — not considering empty, null, huge, or concurrent cases.

## Resources

Only verified links. Use them in the recap, never before or during the ladder.

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — reference for JS concepts and syntax
