import type { FileDiff } from "../entities/Diff";
import type { Commit, Version } from "../entities/Version";

export interface VersionRepository {
  /** Versiones de una skill, de la más reciente a la más antigua. */
  historyOf(skillId: string): Promise<Version[]>;
  /** Últimos commits sobre la carpeta de skills; rutas relativas a ella. */
  recentCommits(limit: number): Promise<Commit[]>;
  diffOf(skillId: string, hash: string): Promise<FileDiff[]>;
  /** Contenido de SKILL.md en esa versión ("" si no existía). */
  snapshotOf(skillId: string, hash: string): Promise<string>;
  /** Ficheros con cambios aún sin commitear. */
  pendingChangesOf(skillId: string): Promise<string[]>;
}
