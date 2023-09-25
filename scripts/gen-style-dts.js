"use strict";

const { globSync } = require("glob");
const { readFileSync, writeFileSync } = require("node:fs");
const postcss = require("postcss");
const postcssModules = require("postcss-modules");
const { less } = require("./lib/less.js");
const { findPackages } = require("./root.js");

for (const packageDirectory of findPackages()) {
  processPackage(packageDirectory);
}

function processPackage(packageDirectory) {
  const lessFiles = globSync(["lib/**/*.module.less"], {
    cwd: packageDirectory,
    absolute: true,
  });
  for (const lessFile of lessFiles) {
    const content = readFileSync(lessFile, "utf-8");
    less
      .render(content, {
        plugins: [],
        relativeUrls: true,
        filename: lessFile,
      })
      .then(({ css, imports }) => {
        return writeDts(css, lessFile);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

function writeDts(css, lessFile) {
  const plugin = postcssModules({
    exportGlobals: true,
    localsConvention: "dashesOnly",
    getJSON: (inputFileName, mapping, outputFileName) => {
      writeFileSync(
        outputFileName,
        Object.keys(mapping)
          .map((key) => `export const ${key}: string;\n`)
          .join(""),
      );
    },
  });
  return postcss([plugin]).process(css, {
    from: `${lessFile}`,
    to: `${lessFile}.d.ts`,
  });
}
