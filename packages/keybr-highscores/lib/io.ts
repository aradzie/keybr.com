import { Layout } from "@keybr/keyboard";
import { type File } from "@sosimple/fsx-file";
import { LockFile } from "@sosimple/fsx-lockfile";
import { exponentialDelay } from "@sosimple/retry";
import { HighScores, type HighScoresRow } from "./highscores.ts";

export async function readTable(file: File): Promise<HighScores> {
  try {
    return new HighScores(
      (await file.readJson({ reviver })) as HighScoresRow[],
    );
  } catch {
    return new HighScores([]);
  }
}

export async function writeTable(file: File, table: HighScores): Promise<void> {
  // In case of concurrent modification last writer wins.
  // TODO Implement optimistic concurrency control.
  await LockFile.withLock(
    file,
    { retryLimit: 3, delayer: exponentialDelay(10) },
    async (lock) => {
      await lock.writeFile(JSON.stringify(table));
    },
  );
}

export function reviver(key: any, value: any): any {
  switch (key) {
    case "layout":
      return Layout.ALL.get(value);
    case "timeStamp":
      return new Date(value);
    default:
      return value;
  }
}
