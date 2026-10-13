import type { Skill } from "../entities/Skill";

/**
 * SKILL.md listo para instalar: solo el frontmatter que entiende Claude o los Agents
 * (name, description) + el cuerpo. El resto (metadata, links…) se omite.
 * name es kebab-case; description va con JSON.stringify: escalar YAML válido aunque haya ":" o comillas.
 */
export function toSkillMarkdown(
	skill: Pick<Skill, "name" | "description">,
	body: string,
): string {
	return [
		"---",
		`name: ${skill.name}`,
		`description: ${JSON.stringify(skill.description)}`,
		"---",
		"",
		body.trim(),
		"",
	].join("\n");
}
