import type { ActivityEntry } from "@domain/entities/Version";
import type { SkillRepository } from "@domain/repositories/SkillRepository";
import type { VersionRepository } from "@domain/repositories/VersionRepository";
import { ownerOf } from "@domain/services/skillPaths";

export class GetRecentActivity {
  constructor(
    private readonly skills: SkillRepository,
    private readonly versions: VersionRepository,
  ) {}

  async execute(limit = 20): Promise<ActivityEntry[]> {
    const [skills, commits] = await Promise.all([this.skills.findAll(), this.versions.recentCommits(limit)]);
    const ids = skills.map((s) => s.id);
    return commits.map(({ files, ...version }) => ({
      ...version,
      skillIds: [...new Set(files.map((f) => ownerOf(f, ids)).filter((id) => id !== undefined))],
    }));
  }
}
