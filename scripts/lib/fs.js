"use strict";

const { mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const { dirname } = require("node:path");

function readJsonSync(path) {
  const content = readFileSync(path, "utf-8");
  return JSON.parse(content);
}

module.exports.readJsonSync = readJsonSync;

function writeJsonSync(path, data, space = 2) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, space) + "\n");
}

module.exports.writeJsonSync = writeJsonSync;
