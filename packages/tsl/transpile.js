import { createHash } from "node:crypto";
import { mkdir, open, readFile, rename } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import ts from "typescript";

/**
 * @param {string} fileName
 * @return {boolean}
 */
export function isTs(fileName) {
  return fileName.endsWith(".ts");
}

/**
 * @param {string} fileName
 * @return {boolean}
 */
export function isTsx(fileName) {
  return fileName.endsWith(".tsx");
}

/**
 * @param {string} source
 * @param {string} fileName
 * @return {Promise<string>}
 */
export async function transpile(source, fileName) {
  const options = getTranspileOptions(fileName);
  const slug = fileName.replace(/[./\\:]/g, "_");
  const hash = createHash("md5")
    .update(fileName)
    .update(source)
    .update(JSON.stringify(options))
    .update(ts.version)
    .digest("hex");
  const cachedFilename = join(tmpdir(), `tsl`, `${slug}_${hash}.js`);
  try {
    return await readFile(cachedFilename, "utf-8");
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  const { outputText, diagnostics } = ts.transpileModule(source, options);
  if (diagnostics.length > 0) {
    for (const diagnostic of diagnostics) {
      console.error(diagnostic);
    }
    throw new Error(`Error transpiling file [${fileName}]`);
  }
  try {
    await mkdir(dirname(cachedFilename), { recursive: true });
    const f = await open(cachedFilename + ".lock", "wx");
    await f.writeFile(outputText, "utf-8");
    await f.close();
    await rename(cachedFilename + ".lock", cachedFilename);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
  return outputText;
}

/**
 * @param {string} fileName
 * @return {ts.TranspileOptions}
 */
function getTranspileOptions(fileName) {
  const compilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    importHelpers: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    inlineSourceMap: true,
    inlineSources: true,
  };
  if (isTsx(fileName)) {
    compilerOptions.jsx = ts.JsxEmit.ReactJSX;
  }
  return {
    fileName,
    compilerOptions,
  };
}
