"use strict";

const { readFileSync } = require("node:fs");
const { default: lessFactory } = require("less/lib/less/index.js");
const {
  default: AbstractFileManager,
} = require("less/lib/less/environment/abstract-file-manager.js");
const {
  default: AbstractPluginLoader,
} = require("less/lib/less/environment/abstract-plugin-loader.js");
const {
  default: Environment,
} = require("less/lib/less/environment/environment.js");

const ext = ".less";

class FileManager extends AbstractFileManager {
  supports(filename) {
    return true;
  }

  supportsSync(filename) {
    return true;
  }

  loadFile(filename, currentDirectory, options, environment, callback) {
    try {
      const file = this.loadFileSync(
        filename,
        currentDirectory,
        options,
        environment,
      );
      callback(null, file);
    } catch (err) {
      callback(err, null);
    }
  }

  loadFileSync(filename, currentDirectory, options, environment) {
    if (!filename.endsWith(ext)) {
      filename = filename + ext;
    }
    filename = require.resolve(filename, { paths: [currentDirectory] });
    const contents = readFileSync(filename, "utf-8");
    return { filename, contents };
  }
}

class PluginLoader extends AbstractPluginLoader {}

const less = lessFactory(new Environment(), [new FileManager()]);

less.PluginLoader = PluginLoader;

module.exports.less = less;
