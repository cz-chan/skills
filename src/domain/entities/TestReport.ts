/** Resultado de las pruebas de una skill: evals/<id>/TESTING.md. */
export interface TestReport {
  /** Mismo id que la skill: evals/<id>/ corresponde a skills/<id>/. */
  skillId: string;
  date: Date;
  model: string;
  harness: string;
  passed: number;
  total: number;
  /** Commit de la skill que se probó; vacío si no se fijó. */
  skillCommit?: string;
}

/**
 * current: se probó la versión actual.
 * outdated: la skill cambió después de las pruebas.
 * unpinned: no consta qué versión se probó.
 */
export type TestStatus = "current" | "outdated" | "unpinned";

export interface SkillTests {
  report: TestReport;
  status: TestStatus;
}

/** Una prueba de evals/<id>/evals.json. */
export interface EvalCase {
  id: string;
  name: string;
  /** Estado inicial del sandbox. */
  state: string;
  prompt: string;
  checks: string[];
}

/** Resumen de un turno: evals/<id>/runs/<fecha>/<ronda>/<prueba>[-<turno>].txt */
export interface RunTurn {
  turn?: number;
  text: string;
}

export interface TestTranscript {
  /** Id de la prueba: "T1", "T7"… */
  caseId: string;
  turns: RunTurn[];
}

/** Una ronda de ejecuciones, p. ej. 2026-10-13 / round-2. */
export interface TestRound {
  date: string;
  round: string;
  transcripts: TestTranscript[];
}

export interface TestDetails {
  cases: EvalCase[];
  /** De la más reciente a la más antigua. */
  rounds: TestRound[];
}
