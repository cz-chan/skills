import { posix } from "node:path";
import { fileSlugOf } from "./skillFiles";

/**
 * URL pública de un enlace relativo a un .md de skill, o undefined si no aplica.
 * `source`: fichero de origen relativo a skills/ ("code-mentor/SKILL.md").
 * `isSkill`: si una carpeta (relativa a skills/) contiene un SKILL.md.
 */
export function skillLinkOf(source: string, href: string, isSkill: (dir: string) => boolean): string | undefined {
	if (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(href)) return; // externo, absoluto o ancla
	const [, target, rest = ""] = href.match(/^([^#?]*\.md)([#?].*)?$/) ?? [];
	if (!target) return;

	const resolved = posix.normalize(posix.join(posix.dirname(source), target));
	if (resolved.startsWith("..")) return; // fuera de skills/

	// Skill dueña: la carpeta más cercana con SKILL.md
	let id = posix.dirname(resolved);
	while (id !== "." && !isSkill(id)) id = posix.dirname(id);
	if (id === ".") return;

	const path = resolved.slice(id.length + 1);
	if (path === "SKILL.md") return `/skills/${id}/${rest}`;
	if (path === "CREDITS.md") return;
	return `/skills/${id}/${fileSlugOf(path)}/${rest}`;
}
