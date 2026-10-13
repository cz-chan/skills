import type { DiffLine, FileDiff } from "@domain/entities/Diff";
import type { Version } from "@domain/entities/Version";

export const FIELD = "\x1f";
export const RECORD = "\x1e";
export const LOG_FORMAT = ["%H", "%h", "%aI", "%an", "%s", "%b"].join("%x1f") + "%x1e";

export function parseVersion(raw: string): Version {
  const [hash, shortHash, date, author, subject, body = ""] = raw.split(FIELD);
  return { hash, shortHash, date: new Date(date), author, subject, body: body.trim() };
}

export function parseLog(raw: string): Version[] {
  return splitRecords(raw).map(parseVersion);
}

export function splitRecords(raw: string): string[] {
  return raw
    .split(RECORD)
    .map((r) => r.trim())
    .filter(Boolean);
}

function lineKind(text: string): DiffLine["kind"] {
  if (text.startsWith("@@")) return "hunk";
  if (text.startsWith("+")) return "add";
  if (text.startsWith("-")) return "del";
  return "ctx";
}

/** Parsea la salida de `git show` en un diff por fichero. `prefix` se quita de las rutas. */
export function parseDiff(raw: string, prefix: string): FileDiff[] {
  return raw
    .split(/^diff --git /m)
    .filter(Boolean)
    .map((block) => {
      const rows = block.split("\n");
      const target = rows.find((l) => l.startsWith("+++ ")) ?? "";
      const source = rows.find((l) => l.startsWith("--- ")) ?? "";
      const path = (target.endsWith("/dev/null") ? source : target)
        .replace(/^(\+\+\+|---) [ab]\//, "")
        .replace(prefix, "");
      const start = rows.findIndex((l) => l.startsWith("@@"));
      const lines = (start === -1 ? [] : rows.slice(start))
        .filter((l) => l && !l.startsWith("\\ No newline"))
        .map((text) => ({ kind: lineKind(text), text }));
      return {
        path,
        added: lines.filter((l) => l.kind === "add").length,
        deleted: lines.filter((l) => l.kind === "del").length,
        lines,
      };
    });
}
