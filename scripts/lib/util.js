"use strict";

function moduleName(path) {
  let i = path.indexOf("/");
  if (i !== -1 && path.startsWith("@")) {
    i = path.indexOf("/", i + 1);
  }
  if (i !== -1) {
    return path.substring(0, i);
  }
  return path;
}

module.exports.moduleName = moduleName;
