import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export function readJsonSync(path) {
  const content = readFileSync(path, "utf-8");
  return JSON.parse(content);
}

export function writeJsonSync(path, data, space = 2) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, space) + "\n");
}
