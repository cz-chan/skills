import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCollection } from "astro:content";
import type { EvalCase, TestDetails, TestReport, TestRound } from "@domain/entities/TestReport";
import type { TestReportRepository } from "@domain/repositories/TestReportRepository";
import { groupTranscripts } from "@domain/services/testRuns";

/** Lista de un directorio; [] si no existe. */
const list = (dir: string) => readdir(dir, { withFileTypes: true }).catch(() => []);

export class ContentTestReportRepository implements TestReportRepository {
  /** `evalsDir`: carpeta evals/ relativa al proyecto. */
  constructor(private readonly evalsDir: string) {}

  async findAll(): Promise<TestReport[]> {
    return (await getCollection("tests")).map((entry) => ({
      skillId: entry.id,
      date: entry.data.date,
      model: entry.data.model,
      harness: entry.data.harness,
      passed: entry.data.passed,
      total: entry.data.total,
      skillCommit: entry.data.skillCommit || undefined,
    }));
  }

  async detailsOf(skillId: string): Promise<TestDetails> {
    const dir = join(this.evalsDir, skillId);
    const [cases, rounds] = await Promise.all([this.casesOf(dir), this.roundsOf(join(dir, "runs"))]);
    return { cases, rounds };
  }

  private async casesOf(dir: string): Promise<EvalCase[]> {
    const raw = await readFile(join(dir, "evals.json"), "utf8").catch(() => "");
    if (!raw) return [];
    const evals: Partial<EvalCase>[] = JSON.parse(raw).evals ?? [];
    return evals.map((e) => ({
      id: String(e.id ?? ""),
      name: e.name ?? "",
      state: e.state ?? "",
      prompt: e.prompt ?? "",
      checks: e.checks ?? [],
    }));
  }

  /** runs/<fecha>/<ronda>/*.txt, de la ronda más reciente a la más antigua. */
  private async roundsOf(runsDir: string): Promise<TestRound[]> {
    const rounds: TestRound[] = [];
    for (const date of await list(runsDir)) {
      if (!date.isDirectory()) continue;
      for (const round of await list(join(runsDir, date.name))) {
        if (!round.isDirectory()) continue;
        const roundDir = join(runsDir, date.name, round.name);
        const files = await Promise.all(
          (await list(roundDir))
            .filter((f) => f.isFile())
            .map(async (f) => ({ name: f.name, text: await readFile(join(roundDir, f.name), "utf8") })),
        );
        rounds.push({ date: date.name, round: round.name, transcripts: groupTranscripts(files) });
      }
    }
    return rounds.sort((a, b) => `${b.date}/${b.round}`.localeCompare(`${a.date}/${a.round}`));
  }
}
