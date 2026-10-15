import { existsSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { skillLinkOf } from "../../domain/services/skillLinks";

const SKILLS_ROOT = resolve("skills");

type LinkNode = { url: string };
type Context = {
	fileURL: URL | undefined;
	setProperty(node: LinkNode, key: "url", value: string): void;
};

const isSkill = (dir: string) => existsSync(join(SKILLS_ROOT, dir, "SKILL.md"));

/** Reescribe el enlace si apunta a un .md de skill. */
function rewrite(node: LinkNode, ctx: Context) {
	if (!ctx.fileURL) return;
	const source = relative(SKILLS_ROOT, fileURLToPath(ctx.fileURL)).split(sep).join("/");
	if (source.startsWith("..")) return; // p. ej. evals/
	const url = skillLinkOf(source, node.url, isSkill);
	if (url) ctx.setProperty(node, "url", url);
}

/** Plugin mdast de Sätteri: enlaces relativos entre .md de skills → URLs del visor. */
export const skillLinksPlugin = {
	name: "skill-links",
	link: rewrite,
	definition: rewrite,
};
