import { fileURLToPath } from "node:url";
import { importStyles } from "./import-styles.ts";

export async function load(url: string, context: any, nextLoad: any) {
  if (url.startsWith("file:")) {
    const fileName = fileURLToPath(url);

    for (const ext of [".css", ".less"]) {
      if (fileName.endsWith(ext)) {
        return {
          format: "module",
          shortCircuit: true,
          source: await importStyles(fileName),
        };
      }
    }

    for (const ext of [
      ".data",
      ".stats",
      ".jpg",
      ".png",
      ".svg",
      ".mp3",
      ".wav",
    ]) {
      if (fileName.endsWith(ext)) {
        return {
          format: "module",
          shortCircuit: true,
          source: `export default "${fileName}";`,
        };
      }
    }
  }

  return nextLoad(url, context);
}
