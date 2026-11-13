import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type { Skill, SkillFile } from "@domain/entities/Skill";
import type { SkillRepository } from "@domain/repositories/SkillRepository";
import { fileTitleOf } from "@domain/services/skillFiles";
import { ownerOf } from "@domain/services/skillPaths";

const toSkill = (entry: CollectionEntry<"skills">, files: SkillFile[]): Skill => ({
  id: entry.id,
  name: entry.data.name,
  description: entry.data.description,
  author: entry.data.metadata.author,
  createdAt: entry.data.metadata.created,
  updatedAt: entry.data.metadata.updatedAt,
  credits: entry.data.credits,
  links: entry.data.links,
  files,
});

export class ContentSkillRepository implements SkillRepository {
  async findAll(): Promise<Skill[]> {
    const entries = await getCollection("skills");
    const files = await this.filesBySkill(entries.map((entry) => entry.id));
    return entries.map((entry) => toSkill(entry, files.get(entry.id) ?? []));
  }

  async bodyOf(id: string): Promise<string> {
    return (await getEntry("skills", id))?.body ?? "";
  }

  async fileBodyOf(id: string, path: string): Promise<string> {
    return (await getEntry("files", `${id}/${path}`))?.body ?? "";
  }

  /** Reparte los ficheros extra entre sus skills; los que no son de ninguna se ignoran. */
  private async filesBySkill(skillIds: string[]): Promise<Map<string, SkillFile[]>> {
    const bySkill = new Map<string, SkillFile[]>();
    for (const entry of await getCollection("files")) {
      const owner = ownerOf(entry.id, skillIds);
      if (!owner) continue;
      const path = entry.id.slice(owner.length + 1);
      const list = bySkill.get(owner) ?? [];
      list.push({ path, title: fileTitleOf(entry.body ?? "", path) });
      bySkill.set(owner, list);
    }
    for (const list of bySkill.values()) list.sort((a, b) => a.path.localeCompare(b.path));
    return bySkill;
  }
}
