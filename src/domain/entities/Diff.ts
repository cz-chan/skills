export type DiffLineKind = "add" | "del" | "hunk" | "ctx";

export interface DiffLine {
  kind: DiffLineKind;
  text: string;
}

export interface FileDiff {
  path: string;
  added: number;
  deleted: number;
  lines: DiffLine[];
}
