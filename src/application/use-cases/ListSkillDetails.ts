import type { Skill } from "@domain/entities/Skill";
import type { SkillTests } from "@domain/entities/TestReport";
import type { Version } from "@domain/entities/Version";
import { toSkillMarkdown } from "@domain/services/skillMarkdown";
import type { SkillRepository } from "@domain/repositories/SkillRepository";
import type { TestReportRepository } from "@domain/repositories/TestReportRepository";
import type { VersionRepository } from "@domain/repositories/VersionRepository";
import { testStatusOf } from "@domain/services/testStatus";

export interface SkillDetail {
  skill: Skill;
  /** SKILL.md instalable (name + description + cuerpo), para copiarlo. */
  markdown: string;
  history: Version[];
  pendingChanges: string[];
  /** Informe de evals/<id>/TESTING.md, si la skill tiene pruebas. */
  tests?: SkillTests;
}

export class ListSkillDetails {
  constructor(
    private readonly skills: SkillRepository,
    private readonly versions: VersionRepository,
    private readonly tests: TestReportRepository,
  ) {}

  async execute(): Promise<SkillDetail[]> {
    const [skills, reports] = await Promise.all([this.skills.findAll(), this.tests.findAll()]);
    const reportOf = new Map(reports.map((report) => [report.skillId, report]));
    return Promise.all(
      skills.map(async (skill) => {
        const [body, history, pendingChanges] = await Promise.all([
          this.skills.bodyOf(skill.id),
          this.versions.historyOf(skill.id),
          this.versions.pendingChangesOf(skill.id),
        ]);
        const report = reportOf.get(skill.id);
        const tests = report && { report, status: testStatusOf(report, history, pendingChanges.length > 0) };
        return { skill, markdown: toSkillMarkdown(skill, body), history, pendingChanges, tests };
      }),
    );
  }
}
