import { getEntry, render } from "astro:content";

/** Devuelve el componente Astro con el SKILL.md actual renderizado. */
export async function renderSkillBody(id: string) {
  const entry = await getEntry("skills", id);
  return entry ? (await render(entry)).Content : undefined;
}

/** Igual que renderSkillBody, para un fichero extra; `path` relativo a la carpeta de la skill. */
export async function renderSkillFile(id: string, path: string) {
  const entry = await getEntry("files", `${id}/${path}`);
  return entry ? (await render(entry)).Content : undefined;
}

/** Informe de pruebas de la skill: evals/<id>/TESTING.md. */
export async function renderTestReport(id: string) {
  const entry = await getEntry("tests", id);
  return entry ? (await render(entry)).Content : undefined;
}
