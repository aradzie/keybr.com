import { join, resolve } from "node:path";

export const rootDir = resolve(__dirname, "..");

export function pathTo(...path: string[]): string {
  return join(rootDir, ...path);
}
