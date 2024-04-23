#!/usr/bin/env -S node -r @keybr/tsl

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { compiler } from "peggy";
import { optimize } from "./optimize.ts";
import { parse } from "./parse.ts";
import { validate } from "./validate.ts";

if (compiler == null) {
  /* Suppress the unused dependency warning. */
}

export const rootDir = resolve(__dirname, "..");

for (const item of readdirSync(pathTo("lib/syntax"))) {
  if (item.endsWith(".g")) {
    const path_g = pathTo("lib/syntax", item);
    const path_ts = pathTo("lib/syntax", basename(item, ".g") + ".ts");
    console.log(path_g, "->", path_ts);
    let grammar = parse(readFileSync(path_g, "utf-8"), {
      grammarSource: path_g,
    });
    grammar = optimize(validate(grammar));
    const lines = [];
    lines.push(`// Generated file, do not edit.`);
    lines.push(``);
    lines.push(`import { type Rules } from "../ast.ts";`);
    lines.push(``);
    lines.push(`export default ${JSON.stringify(grammar, null, 2)} as Rules;`);
    lines.push(``);
    writeFileSync(path_ts, lines.join("\n"));
  }
}

export function pathTo(...path: string[]): string {
  return join(rootDir, ...path);
}
