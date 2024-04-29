#!/usr/bin/env -S node -r @keybr/tsl

import { readFileSync, writeFileSync } from "node:fs";
import { Parser } from "commonmark";
import { pathTo } from "./root.ts";

for (const name of [
  "en-alice-wonderland", //
  "en-call-wild",
  "en-jekyll-hyde",
]) {
  generate(
    pathTo(`books/${name}.txt`),
    pathTo(`../keybr-content-books/lib/data/${name}.json`),
  );
}

function generate(input: string, output: string): void {
  let chapter = [];
  let para = [];
  let line = "";

  const content = readFileSync(input, "utf-8");
  const reader = new Parser({ smart: true });
  const document = reader.parse(content);
  const walker = document.walker();
  let step;
  while ((step = walker.next())) {
    const { entering, node } = step;
    const { type, literal, isContainer } = node;
    switch (type) {
      case "document":
        break;
      case "heading":
        if (entering) {
          line = "";
        } else {
          line = normalize(line);
          if (line.length > 0) {
            chapter.push([line, (para = [])]);
          }
          line = "";
        }
        break;
      case "paragraph":
        if (entering) {
          line = "";
        } else {
          line = normalize(line);
          if (line.length > 0) {
            para.push(line);
          }
          line = "";
        }
        break;
      case "list":
        throw new Error("not supported");
      case "item":
        throw new Error("not supported");
      case "block_quote":
        throw new Error("not supported");
      case "emph":
        break;
      case "strong":
        break;
      case "text":
        line += literal;
        break;
      case "softbreak":
        line += " ";
        break;
      case "linebreak":
        line += "\n";
        break;
    }
  }

  writeFileSync(output, JSON.stringify(chapter, null, 2), "utf-8");
}

function normalize(line: string): string {
  return line.replace(/\n+/g, "\n").replace(/\s+/g, " ").trim();
}
