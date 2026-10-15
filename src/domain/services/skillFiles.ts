/** Título de un fichero: su primer `# encabezado` o, si no hay, el nombre sin extensión. */
export function fileTitleOf(body: string, path: string): string {
	const heading = body.match(/^#\s+(.+?)\s*#*\s*$/m)?.[1];
	return heading ?? path.split("/").pop()!.replace(/\.md$/, "");
}

/** Carpeta de un fichero dentro de la skill: "domains/math.md" → "domains"; raíz → "". */
export function folderOf(path: string): string {
	const index = path.lastIndexOf("/");
	return index === -1 ? "" : path.slice(0, index);
}

/** Ruta pública del fichero: "domains/math.md" → "domains/math". */
export function fileSlugOf(path: string): string {
	return path.replace(/\.md$/, "");
}

/** Nombre del fichero con extensión: "domains/math.md" → "math.md". */
export function fileNameOf(path: string): string {
	return path.slice(path.lastIndexOf("/") + 1);
}

/**
 * Motivo por el que la URL de un fichero pisaría otra página, o undefined si está libre.
 * Los ficheros comparten /skills/<id>/ con tests/, versions/ y las skills anidadas.
 */
export function fileRouteConflictOf(skillId: string, path: string, skillIds: string[]): string | undefined {
	const slug = fileSlugOf(path);
	if (slug === "tests") return "pisa la página de tests";
	if (slug.startsWith("versions/")) return "pisa las páginas de versiones";
	if (skillIds.includes(`${skillId}/${slug}`)) return `pisa la skill ${skillId}/${slug}`;
}
