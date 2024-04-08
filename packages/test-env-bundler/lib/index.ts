// https://levelup.gitconnected.com/how-to-add-hooks-to-node-js-require-function-dee7acd12698
// https://github.com/nodejs/node/blob/main/lib/internal/modules/cjs/loader.js

import { Module } from "node:module";

const stylesModule = new Proxy(
  {},
  {
    get: (target, p) => {
      const s = String(p);
      switch (s) {
        case "__esModule":
          return true;
        case "default":
          return stylesModule;
        default:
          return `${s}`;
      }
    },
  },
) as any;

for (const ext of [".data", ".stats", ".jpg", ".png", ".svg", ".mp3", ".wav"]) {
  (Module as any)._extensions[ext] = loadAsset;
}

for (const ext of [".css", ".less"]) {
  (Module as any)._extensions[ext] = loadStyles;
}

function loadAsset(module: NodeJS.Module, fileName: string): void {
  module.exports = fileName;
}

function loadStyles(module: NodeJS.Module, fileName: string): void {
  module.exports = stylesModule;
}
