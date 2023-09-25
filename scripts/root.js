"use strict";

const { resolve } = require("node:path");
const { globSync } = require("glob");

const rootDir = resolve(__dirname, "..");

function findPackages() {
  return globSync("packages/*", {
    cwd: rootDir,
    absolute: true,
  });
}

module.exports.rootDir = rootDir;
module.exports.findPackages = findPackages;
