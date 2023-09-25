import { type Stats } from "@sosimple/fsx";
import { type File } from "@sosimple/fsx-file";

export async function fstat(file: File): Promise<Stats | null> {
  try {
    return await file.stat();
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return null;
    } else {
      throw err;
    }
  }
}
