import type { Skill } from "../entities/Skill";

export interface SkillRepository {
  findAll(): Promise<Skill[]>;
  /** Cuerpo markdown del SKILL.md actual, sin frontmatter. */
  bodyOf(id: string): Promise<string>;
  /** Contenido de un fichero extra; `path` relativo a la carpeta de la skill. */
  fileBodyOf(id: string, path: string): Promise<string>;
}
