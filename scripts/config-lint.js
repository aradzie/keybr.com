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
  const modules = findDeps(packageDirectory, typescriptFiles, lessFiles);
  const packageJsonFile = join(packageDirectory, "package.json");
  if (existsSync(packageJsonFile)) {
    const packageJson = processPackageJson(
      packageJsonFile,
      typescriptFiles,
      lessFiles,
    );
    const { module, browser, dependencies, devDependencies } = packageJson;
    if (typeof module === "string") {
      if (!existsSync(join(packageDirectory, module))) {
        console.error("Invalid module field in", packageJsonFile);
      }
    }
    if (typeof browser === "string") {
      if (!existsSync(join(packageDirectory, browser))) {
        console.error("Invalid browser field in", packageJsonFile);
      }
    }
    const tsJsonFile = join(packageDirectory, "tsconfig.json");
    if (typescriptFiles.length > 0) {
      processTsconfigJson(packageJson, tsJsonFile);
    }
    if (dependencies != null) {
      printUnusedDeps(packageJsonFile, dependencies, modules);
    }
    if (devDependencies != null) {
      printUnusedDeps(packageJsonFile, devDependencies, modules);
    }
  }
}

function processPackageJson(packageJsonFile, typescriptFiles, lessFiles) {
  const {
    name,
    version,
    type,
    main,
    types,
    module,
    browser,
    exports,
    imports,
    sideEffects,
    dependencies = {},
    devDependencies = {},
    peerDependencies,
    optionalDependencies,
    scripts: { clean, compile, test, ...scripts } = {},
    ava = {},
  } = readJsonSync(packageJsonFile);

  const hasTs = typescriptFiles.length > 0;
  const hasTsTests = typescriptFiles.some(
    (item) => item.endsWith(".test.ts") || item.endsWith(".test.tsx"),
  );

  const opt = {};

  if (hasTs) {
    Object.assign(scripts, {
      clean: "rm -fr .types",
      compile: "tsc",
      test,
    });
    if (hasTsTests && !test?.includes("--test")) {
      Object.assign(scripts, {
        test: "ava",
      });
      const { nodeArguments, serial } = ava;
      Object.assign(opt, {
        ava: {
          files: ["lib/**/*.test.*"],
          extensions: {
            ts: "module",
            tsx: "module",
          },
          nodeArguments,
          serial,
        },
      });
    }
  }

  const result = {
    private: true,
    name,
    version,
    type,
    main,
    types,
    module,
    browser,
    exports,
    imports,
    sideEffects,
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
    scripts,
    ...opt,
  };

  writeJsonSync(packageJsonFile, sortJson(result, packageJsonKeys));

  return result;
}

function processTsconfigJson(packageJson, file) {
  if (!existsSync(file)) {
    return;
  }
  const json = readJsonSync(file);
  writeJsonSync(file, sortJson(json, tsconfigJsonKeys));
}
