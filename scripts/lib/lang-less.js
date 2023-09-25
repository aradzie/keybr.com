"use strict";

const { moduleName } = require("./util.js");

function findLessDeps(fileName, source) {
  const modules = new Set();
  for (const line of source.split("\n")) {
    const match = /@import "([^"]*)"/.exec(line);
    if (match != null) {
      const module = match[1];
      if (module.startsWith("~")) {
        modules.add(moduleName(module.substring(1)));
      }
    }
  }
  return modules;
}

module.exports.findLessDeps = findLessDeps;
