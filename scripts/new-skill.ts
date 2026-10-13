import { existsSync, mkdirSync, writeFileSync } from "node:fs";

// Acepta rutas anidadas: "frontend/react-hooks".
const id = process.argv[2];
if (!id || !/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(id)) {
	console.error("use: bun run new <name> | <category>/<name>  (kebab-case)");
	process.exit(1);
}

const dir = `skills/${id}`;
if (existsSync(dir)) {
	console.error(`Ya existe ${dir}`);
	process.exit(1);
}

const name = id.split("/").at(-1);
const created = new Date().toISOString().slice(0, 10);

mkdirSync(dir, { recursive: true });
writeFileSync(
	`${dir}/SKILL.md`,
	`---\nname: ${name}\ndescription: TODO\nmetadata:\n  created: "${created}"\n---\n\n# ${name}\n`,
);
console.log(`Creada ${dir}/SKILL.md`);
