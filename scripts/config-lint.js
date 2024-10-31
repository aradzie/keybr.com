import { existsSync } from "node:fs";
import { join } from "node:path";
import { globSync } from "glob";
import { readJsonSync, writeJsonSync } from "./lib/fs-json.js";
import { packageJsonKeys, tsconfigJsonKeys } from "./lib/key-order.js";
import { findDeps, printUnusedDeps } from "./lib/lang.js";
import { sortJson } from "./lib/sort-json.js";
import { findPackages } from "./root.js";

for (const packageDirectory of findPackages()) {
  processPackage(packageDirectory);
}

function processPackage(packageDirectory) {
  const typescriptFiles = globSync(["lib/**/*.@(ts|tsx)"], {
    cwd: packageDirectory,
    absolute: false,
  });
  const lessFiles = globSync(["lib/**/*.@(less|css)"], {
    cwd: packageDirectory,
    absolute: false,
  });
  const packageJsonFile = join(packageDirectory, "package.json");
  if (existsSync(packageJsonFile)) {
    const packageJson = processPackageJson(packageJsonFile);
    const { dependencies, devDependencies } = packageJson;
    const modules = findDeps(packageDirectory, typescriptFiles, lessFiles);
    if (dependencies != null) {
      printUnusedDeps(packageJsonFile, dependencies, modules);
    }
    if (devDependencies != null) {
      printUnusedDeps(packageJsonFile, devDependencies, modules);
    }
  }
  const tsconfigJsonFile = join(packageDirectory, "tsconfig.json");
  if (existsSync(tsconfigJsonFile)) {
    processTsconfigJson(tsconfigJsonFile);
  }
}

function processPackageJson(file) {
  const json = {
    ...readJsonSync(file),
    private: true,
  };
  writeJsonSync(file, sortJson(json, packageJsonKeys));
  return json;
}

function processTsconfigJson(file) {
  const json = readJsonSync(file);
  writeJsonSync(file, sortJson(json, tsconfigJsonKeys));
  return json;
}
