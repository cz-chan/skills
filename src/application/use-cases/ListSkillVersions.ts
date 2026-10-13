import type { FileDiff } from "@domain/entities/Diff";
import type { Version } from "@domain/entities/Version";
import type { VersionRepository } from "@domain/repositories/VersionRepository";
import type { ListSkillDetails, SkillDetail } from "./ListSkillDetails";

export interface SkillVersion {
  detail: SkillDetail;
  version: Version;
  /** Número de versión, empezando en 1 por la más antigua. */
  number: number;
  diff: FileDiff[];
  snapshot: string;
}

export class ListSkillVersions {
  constructor(
    private readonly details: ListSkillDetails,
    private readonly versions: VersionRepository,
  ) {}

  async execute(): Promise<SkillVersion[]> {
    const details = await this.details.execute();
    const perSkill = await Promise.all(
      details.map((detail) =>
        Promise.all(
          detail.history.map(async (version, index) => {
            const [diff, snapshot] = await Promise.all([
              this.versions.diffOf(detail.skill.id, version.hash),
              this.versions.snapshotOf(detail.skill.id, version.hash),
            ]);
            return { detail, version, number: detail.history.length - index, diff, snapshot };
          }),
        ),
      ),
    );
    return perSkill.flat();
  }
}
