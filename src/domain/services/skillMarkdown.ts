import type { Skill } from "../entities/Skill";

/**
 * SKILL.md listo para instalar: solo el frontmatter que entiende Claude o los Agents
 * (name, description), metadata.author si existe, + el cuerpo. El resto (fechas, links…) se omite.
 * name es kebab-case; description va con JSON.stringify: escalar YAML válido aunque haya ":" o comillas.
 */
export function toSkillMarkdown(
	skill: Pick<Skill, "name" | "description" | "author">,
	body: string,
): string {
	return [
		"---",
		`name: ${skill.name}`,
		`description: ${JSON.stringify(skill.description)}`,
		...(skill.author ? ["metadata:", `  author: ${JSON.stringify(skill.author)}`] : []),
		"---",
		"",
		body.trim(),
		"",
	].join("\n");
}
