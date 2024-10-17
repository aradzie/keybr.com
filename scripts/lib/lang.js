import { readFileSync } from "node:fs";
import { join } from "node:path";
import { findLessDeps } from "./lang-less.js";
import { findTypescriptDeps } from "./lang-typescript.js";

export function findDeps(packageDirectory, typescriptFiles, lessFiles) {
  const modules = new Set();
  for (const fileName of typescriptFiles) {
    const s = join(packageDirectory, fileName);
    const source = readFileSync(s, "utf-8");
    for (const module of findTypescriptDeps(fileName, source)) {
      modules.add(module);
    }
  }
  for (const fileName of lessFiles) {
    const s = join(packageDirectory, fileName);
    const source = readFileSync(s, "utf-8");
    for (const module of findLessDeps(fileName, source)) {
      modules.add(module);
    }
  }
  return modules;
}

export function printUnusedDeps(fileName, dependencies, modules) {
  const types = "@types/";
  for (const dependency of Object.keys(dependencies)) {
    let updated = dependency;
    if (updated.startsWith(types)) {
      updated = dependency.substring(types.length);
    }
    if (!modules.has(updated)) {
      console.warn(`${fileName}: Unused dependency: ${dependency}`);
    }
  }
}
