import { relative } from "node:path";
import { transform } from "@babel/core";
import babelPluginReactCompiler from "babel-plugin-react-compiler";
import { rootDir } from "./root.js";

export default function reactCompilerLoader(input) {
  const options = {
    cwd: rootDir,
    root: rootDir,
    filename: this.resourcePath,
    filenameRelative: relative(rootDir, this.resourcePath),
    sourceFileName: relative(rootDir, this.resourcePath),
    plugins: [[babelPluginReactCompiler, { target: "18" }]],
    parserOpts: {},
    generatorOpts: {
      importAttributesKeyword: "with",
    },
    code: true,
    sourceMaps: true,
    configFile: false,
    babelrc: false,
    babelrcRoots: false,
  };

  const callback = this.async();
  transform(input, options, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result.code, result.map);
    }
  });
}
