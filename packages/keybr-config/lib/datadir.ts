import { join } from "node:path";
import { inject, injectable } from "@fastr/invert";

@injectable()
export class DataDir {
  constructor(@inject("dataDir") readonly dataDir: string) {}

  dataPath(...parts: readonly string[]): string {
    return join(this.dataDir, ...parts);
  }

  /**
   * Returns full path to a user settings file for the given user id.
   */
  userSettingsFile(userId: number): string {
    const s = String(userId).padStart(9, "0");
    return this.dataPath(
      "user_settings", //
      s.substring(0, 3),
      s.substring(3, 6),
      s,
    );
  }

  /**
   * Returns full path to a user stats file for the given user id.
   */
  userStatsFile(userId: number): string {
    const s = String(userId).padStart(9, "0");
    return this.dataPath(
      "user_stats", //
      s.substring(0, 3),
      s.substring(3, 6),
      s,
    );
  }
}
