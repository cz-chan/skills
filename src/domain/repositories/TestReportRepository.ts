import type { TestDetails, TestReport } from "../entities/TestReport";

export interface TestReportRepository {
  findAll(): Promise<TestReport[]>;
  /** Pruebas y transcripciones de evals/<id>/; vacío si no hay. */
  detailsOf(skillId: string): Promise<TestDetails>;
}
