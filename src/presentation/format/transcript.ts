export type TranscriptKind = "user" | "text" | "tool" | "result" | "end";

export interface TranscriptBlock {
  kind: TranscriptKind;
  text: string;
}

const PREFIXES: [string, TranscriptKind][] = [
  ["USER: ", "user"],
  ["TEXT: ", "text"],
  ["TOOL ", "tool"],
  ["RESULT_FINAL ", "end"],
  ["RESULT ", "result"],
];

/**
 * Parte un resumen de turno (salida de summarize.cjs) en bloques.
 * Cada línea con prefijo abre un bloque; las siguientes sin prefijo lo continúan.
 */
export function transcriptBlocks(raw: string): TranscriptBlock[] {
  const blocks: TranscriptBlock[] = [];
  for (const line of raw.split("\n")) {
    const match = PREFIXES.find(([prefix]) => line.startsWith(prefix));
    if (match) {
      blocks.push({ kind: match[1], text: line.slice(match[0].length) });
    } else if (blocks.length) {
      blocks[blocks.length - 1].text += `\n${line}`;
    }
  }
  return blocks.map((b) => ({ ...b, text: b.text.trimEnd() }));
}
