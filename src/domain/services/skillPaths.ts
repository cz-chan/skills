/** Categoría de una skill anidada: "frontend/react/hooks" → "frontend/react". */
export function categoryOf(skillId: string): string | undefined {
  const index = skillId.lastIndexOf("/");
  return index === -1 ? undefined : skillId.slice(0, index);
}

/**
 * Skill a la que pertenece un fichero, relativo a la carpeta de skills.
 * Gana la más profunda para que las skills anidadas no se atribuyan a su padre.
 */
export function ownerOf(file: string, skillIds: string[]): string | undefined {
  return skillIds
    .filter((id) => file.startsWith(`${id}/`))
    .sort((a, b) => b.length - a.length)[0];
}
