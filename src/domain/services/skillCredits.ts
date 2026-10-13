import type { SkillLink } from "../entities/Skill";

const ITEM = /^[-*]\s+\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/;

/**
 * Créditos desde el CREDITS.md de una skill: una lista markdown de `- [título](https://url)`.
 * Es estricto a propósito: una línea que no encaje rompe el build en vez de perderse sin avisar.
 */
export function parseCredits(markdown: string, file: string): SkillLink[] {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(ITEM);
      if (!match) {
        throw new Error(`${file}: crédito mal formado "${line}". Usa "- [título](https://url)".`);
      }
      return { title: match[1], url: match[2] };
    });
}
