"use strict";

const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { findLessDeps } = require("./lang-less.js");
const { findTypescriptDeps } = require("./lang-typescript.js");

function findDeps(packageDirectory, typescriptFiles, lessFiles) {
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

module.exports.findDeps = findDeps;

function printUnusedDeps(fileName, dependencies, modules) {
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

module.exports.printUnusedDeps = printUnusedDeps;
