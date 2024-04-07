"use strict";

const path = require("node:path");
const {
  Compilation,
  sources: { RawSource },
} = require("webpack");

class ManifestPlugin {
  static serialize({ entrypoints, assets }) {
    return JSON.stringify({ entrypoints, assets }, null, 2);
  }

  constructor({
    filename = "manifest.json",
    serialize = ManifestPlugin.serialize,
  } = {}) {
    this.options = {
      filename,
      serialize,
    };
  }

  apply(compiler) {
    const pluginName = this.constructor.name;

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      if (compilation.compiler.parentCompilation != null) {
        return; // mini-css-extract-plugin
      }

      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        () => {
          processAssets(compilation, this.options);
        },
      );
    });
  }
}

function processAssets(compilation, options) {
  const stats = compilation.getStats().toJson({
    all: false,
    publicPath: true,
    ids: true,
    assets: true,
    cachedAssets: true,
    cachedModules: true,
    chunkGroups: true,
    chunkGroupChildren: true,
  });

  const entrypoints = computeEntrypoints(compilation, stats);
  const assets = computeAssets(stats);

  compilation.emitAsset(
    options.filename,
    new RawSource(
      options.serialize({
        entrypoints,
        assets,
      }),
    ),
  );
}

function computeEntrypoints({ entrypoints }, { publicPath, namedChunkGroups }) {
  const result = Object.create(null);

  for (const [name, entrypoint] of entrypoints) {
    const files = entrypoint.getFiles();
    result[name] = {
      assets: groupBy(
        files.map((file) => path.join(publicPath, file)),
        extKey,
      ),
    };
    // preload and prefetch
    const { childAssets } = namedChunkGroups[name];
    for (const [property, assets] of Object.entries(childAssets)) {
      result[name][property] = groupBy(
        assets.map((file) => path.join(publicPath, file)),
        extKey,
      );
    }
  }

  return result;
}

function computeAssets({ publicPath, assets, assetsByChunkName }) {
  const result = [];

  for (const [name, files] of Object.entries(assetsByChunkName)) {
    for (const file of files) {
      result.push({
        name: path.join(publicPath, name + path.extname(file)),
        file: path.join(publicPath, file),
      });
    }
  }

  for (const { name, info: { sourceFilename: file = null } = null } of assets) {
    if (file != null) {
      result.push({
        name: path.join(publicPath, path.basename(file)),
        file: path.join(publicPath, name),
      });
    }
  }

  return Object.fromEntries(
    result
      .sort((a, b) => {
        if (a.name > b.name) {
          return +1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      })
      .map(({ name, file }) => [name, file]),
  );
}

function extKey(file) {
  return path.extname(file).substring(1);
}

function groupBy(list, keyOf) {
  const groups = Object.create(null);
  for (const item of list) {
    (groups[keyOf(item)] ??= []).push(item);
  }
  return groups;
}

module.exports = ManifestPlugin;
