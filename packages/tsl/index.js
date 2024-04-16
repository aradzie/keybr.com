// https://levelup.gitconnected.com/how-to-add-hooks-to-node-js-require-function-dee7acd12698
// https://github.com/nodejs/node/blob/main/lib/internal/modules/cjs/loader.js
// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

"use strict";

const ts = require("typescript");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const Module = require("node:module");

Module._extensions[".ts"] = makeLoad(false);
Module._extensions[".tsx"] = makeLoad(true);

/**
 * @param {boolean} tsx
 */
function makeLoad(tsx) {
  /**
   * @param {Module} module
   * @param {string} fileName
   */
  return function load(module, fileName) {
    const jsContent = fs.readFileSync(fileName, "utf8");
    const tsContent = transpileSync(jsContent, fileName, tsx);
    module._compile(tsContent, fileName);
  };
}

/**
 * @param {string} jsContent
 * @param {string} fileName
 * @param {boolean} tsx
 * @return {string}
 */
function transpileSync(jsContent, fileName, tsx) {
  const options = getTranspileOptions(fileName, tsx);
  const slug = fileName.substring(1).replace(/[./]/g, "_");
  const hash = crypto
    .createHash("md5")
    .update(fileName)
    .update(jsContent)
    .update(JSON.stringify(options))
    .digest("hex");
  const cachedFilename = `/tmp/tsl/${slug}_${hash}.js`;
  const cachedDirname = path.dirname(cachedFilename);
  try {
    return fs.readFileSync(cachedFilename, "utf8");
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  const { outputText: tsContent, diagnostics } = ts.transpileModule(
    jsContent,
    options,
  );
  if (diagnostics.length > 0) {
    for (const diagnostic of diagnostics) {
      console.error(diagnostic);
    }
    throw new Error(`Error transpiling file [${fileName}]`);
  }
  fs.mkdirSync(cachedDirname, { recursive: true });
  fs.writeFileSync(cachedFilename, tsContent, "utf8");
  return tsContent;
}

/**
 * @param {string} fileName
 * @param {boolean} tsx
 * @return {ts.TranspileOptions}
 */
function getTranspileOptions(fileName, tsx) {
  const compilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    resolveJsonModule: true,
    esModuleInterop: true,
    importHelpers: true,
    inlineSourceMap: true,
    inlineSources: true,
  };
  if (tsx) {
    compilerOptions.jsx = ts.JsxEmit.ReactJSX;
  }
  return {
    fileName,
    compilerOptions,
  };
}
