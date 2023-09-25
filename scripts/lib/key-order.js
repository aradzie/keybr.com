"use strict";

module.exports.packageJsonKeys = [
  "private",
  "template",
  "name",
  "version",
  "main",
  "types",
  "module",
  "browser",
  "exports",
  "imports",
  "sideEffects",
  ["dependencies", "alpha"],
  ["devDependencies", "alpha"],
  ["peerDependencies", "alpha"],
  ["optionalDependencies", "alpha"],
  ["scripts", ["clean", "compile", "test"]],
  [
    "ava",
    [
      ["typescript", ["extensions", "rewritePaths"]],
      ["extensions", "alpha"],
      ["files", "alpha"],
      "require",
      "environmentVariables",
      "nodeArguments",
      "serial",
    ],
  ],
];

module.exports.tsconfigJsonKeys = [
  "extends",
  [
    "compilerOptions",
    [
      "rootDir",
      "outDir",
      "target",
      "module",
      "lib",
      "declaration",
      "declarationMap",
      "noEmit",
      "emitDeclarationOnly",
      "incremental",
      "tsBuildInfoFile",
    ],
  ],
  ["include", "alpha"],
  ["exclude", "alpha"],
];
