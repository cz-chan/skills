import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

export class GitClient {
  constructor(private readonly cwd = process.cwd()) {}

  /** Ejecuta git; devuelve "" si falla (sin repo, sin commits, ruta inexistente). */
  async run(args: string[]): Promise<string> {
    try {
      const { stdout } = await exec("git", args, { cwd: this.cwd, maxBuffer: 64 * 1024 * 1024 });
      return stdout;
    } catch {
      return "";
    }
  }
}
