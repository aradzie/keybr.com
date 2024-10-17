import { resolve } from "node:path";
import { globSync } from "glob";

export const rootDir = resolve(import.meta.dirname, "..");

export function findPackages() {
  return globSync("packages/*", {
    cwd: rootDir,
    absolute: true,
  });
}
