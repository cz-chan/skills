import type { FileDiff } from "@domain/entities/Diff";
import type { Commit, Version } from "@domain/entities/Version";
import type { VersionRepository } from "@domain/repositories/VersionRepository";
import type { GitClient } from "./GitClient";
import { FIELD, LOG_FORMAT, parseDiff, parseLog, parseVersion, RECORD, splitRecords } from "./parsers";

export class GitVersionRepository implements VersionRepository {
  private readonly histories = new Map<string, Promise<Version[]>>();

  constructor(
    private readonly git: GitClient,
    private readonly skillsDir: string,
    /** Cachear solo en build: en dev el historial cambia entre peticiones. */
    private readonly cache = false,
  ) {}

  private pathOf(skillId: string): string {
    return `${this.skillsDir}/${skillId}`;
  }

  historyOf(skillId: string): Promise<Version[]> {
    const cached = this.histories.get(skillId);
    if (cached) return cached;
    const history = this.git
      .run(["log", `--format=${LOG_FORMAT}`, "--", this.pathOf(skillId)])
      .then(parseLog);
    if (this.cache) this.histories.set(skillId, history);
    return history;
  }

  async recentCommits(limit: number): Promise<Commit[]> {
    const raw = await this.git.run([
      "log",
      `-n${limit}`,
      `--format=${RECORD}${LOG_FORMAT}`,
      "--name-only",
      "--",
      this.skillsDir,
    ]);
    // Cada commit produce dos registros: metadatos y lista de ficheros.
    return splitRecords(raw).reduce<Commit[]>((commits, chunk) => {
      if (chunk.includes(FIELD)) {
        commits.push({ ...parseVersion(chunk), files: [] });
      } else if (commits.length) {
        commits[commits.length - 1].files = chunk
          .split("\n")
          .filter(Boolean)
          .map((path) => path.replace(`${this.skillsDir}/`, ""));
      }
      return commits;
    }, []);
  }

  async diffOf(skillId: string, hash: string): Promise<FileDiff[]> {
    const raw = await this.git.run(["show", "--format=", "--no-color", hash, "--", this.pathOf(skillId)]);
    return parseDiff(raw, `${this.pathOf(skillId)}/`);
  }

  snapshotOf(skillId: string, hash: string): Promise<string> {
    return this.git.run(["show", `${hash}:${this.pathOf(skillId)}/SKILL.md`]);
  }

  async pendingChangesOf(skillId: string): Promise<string[]> {
    const raw = await this.git.run(["status", "--porcelain", "-uall", "--", this.pathOf(skillId)]);
    return raw
      .split("\n")
      .filter(Boolean)
      .map((l) => l.slice(3).replace(`${this.pathOf(skillId)}/`, ""));
  }
}
