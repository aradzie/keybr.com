"use strict";

const { globSync } = require("glob");
const { existsSync } = require("node:fs");
const { join } = require("node:path");
const { readJsonSync, writeJsonSync } = require("./lib/fs.js");
const { packageJsonKeys, tsconfigJsonKeys } = require("./lib/key-order.js");
const { findDeps, printUnusedDeps } = require("./lib/lang.js");
const { sortJson } = require("./lib/sort-json.js");
const { findPackages } = require("./root.js");

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
    scripts: { clean, compile, ...scripts } = {},
    ava = {},
  } = readJsonSync(packageJsonFile);

  const hasTs = typescriptFiles.length > 0;
  const hasTsTests = typescriptFiles.some(
    (item) => item.endsWith(".test.ts") || item.endsWith(".test.tsx"),
  );

  const opt = {
    scripts: {},
  };
  if (hasTs) {
    Object.assign(opt.scripts, {
      clean: "rm -fr .types",
      compile: "tsc",
    });
    if (hasTsTests) {
      Object.assign(opt.scripts, {
        test: "ava",
      });
      const {
        extensions = [],
        files = [],
        require = [],
        environmentVariables,
        nodeArguments,
        serial,
      } = ava;
      Object.assign(opt, {
        ava: {
          extensions: [...new Set(["ts", "tsx", ...extensions])],
          files: [...new Set(["lib/**/*.test.*", ...files])],
          require: [...new Set(["@keybr/tsl", ...require])],
          environmentVariables,
          nodeArguments,
          serial,
        },
      });
    }
  }
  Object.assign(opt.scripts, scripts);

  const result = {
    private: true,
    name,
    version,
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
