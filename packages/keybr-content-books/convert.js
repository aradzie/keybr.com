#!/usr/bin/env -S node -r @keybr/tsl

"use strict";

const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { Parser } = require("commonmark");

for (const name of ["alice", "jekyll", "wild"]) {
  convert({
    input: join(__dirname, "books", name + ".txt"),
    output: join(__dirname, "lib", "data", name + ".json"),
  });
}

function convert({ input, output }) {
  let chapter = [];
  let para = [];
  let line = "";

  const encoding = "utf8";
  const content = readFileSync(input, encoding);
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

  writeFileSync(output, JSON.stringify(chapter, null, 2), encoding);
}

function normalize(line) {
  return line.replace(/\n+/g, "\n").replace(/\s+/g, " ").trim();
}
