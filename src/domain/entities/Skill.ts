export interface SkillLink {
  title: string;
  url: string;
}

/** Fichero extra de la skill, p. ej. references/math.md. */
export interface SkillFile {
  /** Ruta relativa a la carpeta de la skill: "domains/math.md". */
  path: string;
  title: string;
}

export interface Skill {
  /** Ruta relativa a la carpeta de skills, p. ej. "frontend/react-hooks". */
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  /** metadata.updatedAt del SKILL.md, si lo tiene. */
  updatedAt?: Date;
  credits?: SkillLink[];
  links: SkillLink[];
  files: SkillFile[];
}
