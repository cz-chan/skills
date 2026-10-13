// Composition root: único sitio que conoce las implementaciones concretas.
import { GetRecentActivity } from "@application/use-cases/GetRecentActivity";
import { GetTestDetails } from "@application/use-cases/GetTestDetails";
import { ListSkillDetails } from "@application/use-cases/ListSkillDetails";
import { ListSkillFiles } from "@application/use-cases/ListSkillFiles";
import { ListSkills } from "@application/use-cases/ListSkills";
import { ListSkillVersions } from "@application/use-cases/ListSkillVersions";
import { ContentSkillRepository } from "@infrastructure/content/ContentSkillRepository";
import { ContentTestReportRepository } from "@infrastructure/content/ContentTestReportRepository";
import { GitClient } from "@infrastructure/git/GitClient";
import { GitVersionRepository } from "@infrastructure/git/GitVersionRepository";

export {
	renderSkillBody,
	renderSkillFile,
	renderTestReport,
} from "@infrastructure/content/renderSkillBody";

export const SKILLS_DIR = "skills";
export const EVALS_DIR = "evals";

const skills = new ContentSkillRepository();
const tests = new ContentTestReportRepository(EVALS_DIR);
const versions = new GitVersionRepository(
	new GitClient(),
	SKILLS_DIR,
	import.meta.env.PROD,
);

export const listSkills = new ListSkills(skills, versions, tests);
export const listSkillDetails = new ListSkillDetails(skills, versions, tests);
export const listSkillFiles = new ListSkillFiles(listSkillDetails, skills);
export const listSkillVersions = new ListSkillVersions(
	listSkillDetails,
	versions,
);
export const getTestDetails = new GetTestDetails(tests);
export const getRecentActivity = new GetRecentActivity(skills, versions);
