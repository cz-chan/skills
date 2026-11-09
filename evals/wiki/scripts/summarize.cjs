// Usage: node summarize.cjs <runs-dir> <id> <out-dir>
// Writes one summary per turn in the format the tests page reads: <id>.txt for a single
// turn, <id>-<n>.txt for several.
const fs = require("fs");
const path = require("path");
const [dir, id, out] = process.argv.slice(2);

const evals = JSON.parse(fs.readFileSync(path.join(__dirname, "../evals.json"))).evals;
const prompts = evals.find((e) => e.id === id).turns;
const MAX_RESULT = 400;

const files = fs
	.readdirSync(dir)
	.filter((f) => f.startsWith(`${id}-`) && f.endsWith(".jsonl"))
	.sort((a, b) => parseInt(a.split("-").pop()) - parseInt(b.split("-").pop()));

const resultText = (content) =>
	typeof content === "string" ? content : content.map((part) => part.text ?? "").join("\n");

fs.mkdirSync(out, { recursive: true });
files.forEach((file, index) => {
	const output = [`USER: ${prompts[index]}`];
	let sandbox = "";
	for (const line of fs.readFileSync(path.join(dir, file), "utf8").trim().split("\n")) {
		let event;
		try {
			event = JSON.parse(line);
		} catch {
			continue;
		}
		if (event.cwd) sandbox = event.cwd;
		if (event.type === "assistant") {
			for (const block of event.message.content) {
				if (block.type === "text") output.push(`TEXT: ${block.text}`);
				if (block.type === "tool_use") output.push(`TOOL ${block.name} ${JSON.stringify(block.input)}`);
			}
		}
		if (event.type === "user" && Array.isArray(event.message.content)) {
			for (const block of event.message.content) {
				if (block.type === "tool_result") output.push(`RESULT  ${resultText(block.content).slice(0, MAX_RESULT)}`);
			}
		}
		if (event.type === "result") output.push(`RESULT_FINAL ${event.subtype} turns=${event.num_turns}`);
	}
	const name = files.length > 1 ? `${id}-${index + 1}.txt` : `${id}.txt`;
	fs.writeFileSync(path.join(out, name), `${output.join("\n").replaceAll(sandbox, "<sandbox>")}\n`);
});
