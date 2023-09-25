import { injectable } from "@fastr/invert";
import { DataDir } from "@keybr/config";
import { type Result } from "@keybr/result";
import { File } from "@sosimple/fsx-file";
import { type HighScores } from "./highscores.ts";
import { readTable, writeTable } from "./io.ts";

@injectable()
export class HighScoresFactory {
  readonly #file: File;

  constructor(dataDir: DataDir) {
    this.#file = new File(dataDir.dataPath("highscores.json"));
  }

  async load(): Promise<HighScores> {
    return await readTable(this.#file);
  }

  async append(userId: number, results: readonly Result[]): Promise<void> {
    const table = await readTable(this.#file);
    table.append(userId, results);
    if (table.dirty) {
      await writeTable(this.#file, table);
    }
  }
}
