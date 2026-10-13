import type { TestReport, TestStatus } from "../entities/TestReport";
import type { Version } from "../entities/Version";

/**
 * Compara el commit probado con la última versión de la skill.
 * Con cambios sin commitear la versión actual ya no es la probada.
 */
export function testStatusOf(report: TestReport, history: Version[], hasPendingChanges: boolean): TestStatus {
  const tested = report.skillCommit;
  const latest = history[0];
  if (!tested || !latest) return "unpinned";
  return latest.hash.startsWith(tested) && !hasPendingChanges ? "current" : "outdated";
}
