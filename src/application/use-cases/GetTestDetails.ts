import type { TestDetails } from "@domain/entities/TestReport";
import type { TestReportRepository } from "@domain/repositories/TestReportRepository";

export class GetTestDetails {
  constructor(private readonly tests: TestReportRepository) {}

  execute(skillId: string): Promise<TestDetails> {
    return this.tests.detailsOf(skillId);
  }
}
