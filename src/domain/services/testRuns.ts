import type { TestTranscript } from "../entities/TestReport";

const RUN_FILE = /^(T\d+)(?:-(\d+))?\.txt$/;

/** "T7-12.txt" → { caseId: "T7", turn: 12 }; "T1.txt" → { caseId: "T1" }; otro → undefined. */
export function parseRunFile(name: string): { caseId: string; turn?: number } | undefined {
  const match = name.match(RUN_FILE);
  if (!match) return undefined;
  return { caseId: match[1], turn: match[2] ? Number(match[2]) : undefined };
}

/** Agrupa los turnos por prueba y los ordena: T1 < T2 < T10, turno 2 < turno 10. */
export function groupTranscripts(files: { name: string; text: string }[]): TestTranscript[] {
  const byCase = new Map<string, TestTranscript>();
  for (const file of files) {
    const parsed = parseRunFile(file.name);
    if (!parsed) continue;
    const transcript = byCase.get(parsed.caseId) ?? { caseId: parsed.caseId, turns: [] };
    transcript.turns.push({ turn: parsed.turn, text: file.text });
    byCase.set(parsed.caseId, transcript);
  }
  const number = (id: string) => Number(id.slice(1));
  for (const t of byCase.values()) t.turns.sort((a, b) => (a.turn ?? 0) - (b.turn ?? 0));
  return [...byCase.values()].sort((a, b) => number(a.caseId) - number(b.caseId));
}
