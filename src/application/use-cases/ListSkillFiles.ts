import type { SkillFile } from "@domain/entities/Skill";
import type { SkillRepository } from "@domain/repositories/SkillRepository";
import type { ListSkillDetails, SkillDetail } from "./ListSkillDetails";

export interface SkillFileDetail {
  detail: SkillDetail;
  file: SkillFile;
  /** Contenido del fichero, para copiarlo. */
  body: string;
}

export class ListSkillFiles {
  constructor(
    private readonly details: ListSkillDetails,
    private readonly skills: SkillRepository,
  ) {}

  async execute(): Promise<SkillFileDetail[]> {
    const details = await this.details.execute();
    const perSkill = await Promise.all(
      details.map((detail) =>
        Promise.all(
          detail.skill.files.map(async (file) => ({
            detail,
            file,
            body: await this.skills.fileBodyOf(detail.skill.id, file.path),
          })),
        ),
      ),
    );
    return perSkill.flat();
  }
}
