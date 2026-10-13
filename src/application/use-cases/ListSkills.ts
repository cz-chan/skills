import type { Skill } from "@domain/entities/Skill";
import type { SkillTests } from "@domain/entities/TestReport";
import type { SkillRepository } from "@domain/repositories/SkillRepository";
import type { TestReportRepository } from "@domain/repositories/TestReportRepository";
import type { VersionRepository } from "@domain/repositories/VersionRepository";
import { categoryOf } from "@domain/services/skillPaths";
import { testStatusOf } from "@domain/services/testStatus";

export interface SkillSummary extends Skill {
  category?: string;
  versionCount: number;
  hasPendingChanges: boolean;
  tests?: SkillTests;
}

export class ListSkills {
  constructor(
    private readonly skills: SkillRepository,
    private readonly versions: VersionRepository,
    private readonly tests: TestReportRepository,
  ) {}

  /** Skills ordenadas por ruta, de modo que las de una misma categoría quedan juntas. */
  async execute(): Promise<SkillSummary[]> {
    const [skills, reports] = await Promise.all([this.skills.findAll(), this.tests.findAll()]);
    const reportOf = new Map(reports.map((report) => [report.skillId, report]));
    const summaries = await Promise.all(
      skills.map(async (skill) => {
        const [history, pending] = await Promise.all([
          this.versions.historyOf(skill.id),
          this.versions.pendingChangesOf(skill.id),
        ]);
        const report = reportOf.get(skill.id);
        return {
          ...skill,
          category: categoryOf(skill.id),
          versionCount: history.length,
          hasPendingChanges: pending.length > 0,
          tests: report && { report, status: testStatusOf(report, history, pending.length > 0) },
        };
      }),
    );
    return summaries.sort((a, b) => a.id.localeCompare(b.id));
  }
}
