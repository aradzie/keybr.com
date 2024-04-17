#!/usr/bin/env -S node -r @keybr/tsl

import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { writeFileSync } from "@sosimple/fsx";
import { optimize } from "./optimize.ts";
import { parse } from "./parse.ts";
import { validate } from "./validate.ts";

export const rootDir = resolve(__dirname, "..", "..");

for (const item of readdirSync(pathTo("lib/code"))) {
  if (item.endsWith(".g")) {
    const path_g = pathTo("lib/code", item);
    const path_ts = pathTo("lib/code", basename(item, ".g") + ".ts");
    console.log(path_g, "->", path_ts);
    let grammar = parse(readFileSync(path_g, "utf-8"), {
      grammarSource: path_g,
    });
    grammar = optimize(validate(grammar));
    const lines = [];
    lines.push(`// Generated file, do not edit.`);
    lines.push(``);
    lines.push(`import { type Grammar } from "./ast.ts";`);
    lines.push(``);
    lines.push(
      `export default ${JSON.stringify(grammar, null, 2)} as Grammar;`,
    );
    lines.push(``);
    writeFileSync(path_ts, lines.join("\n"));
  }
}

export function pathTo(...path: string[]): string {
  return join(rootDir, ...path);
}
