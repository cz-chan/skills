export interface Version {
  hash: string;
  shortHash: string;
  date: Date;
  author: string;
  subject: string;
  body: string;
}

/** Commit del repo con los ficheros que tocó. */
export interface Commit extends Version {
  files: string[];
}

/** Commit visto desde el conjunto del repo: incluye qué skills tocó. */
export interface ActivityEntry extends Version {
  skillIds: string[];
}
