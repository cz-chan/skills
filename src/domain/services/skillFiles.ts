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
