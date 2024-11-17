#!/usr/bin/env -S npx tsnode

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Color, parseColor } from "@keybr/color";
import { rootDir } from "@keybr/scripts/root.js";
import { CustomTheme, themeProps, themePropsMap } from "@keybr/themes";
import { parse, walk } from "css-tree";

const inputFile = join(rootDir, "root", "public", "assets", "styles.css");
const outputFile = join(import.meta.dirname, "themes.ts");

async function generate() {
  await writeFile(
    outputFile,
    formatSourceCode(
      importThemes(
        parse(await readFile(inputFile, "utf-8"), {
          parseRulePrelude: true,
          parseValue: true,
        }),
      ),
    ),
  );
}

function importThemes(ast: any) {
  const themes = new Map<string, CustomTheme>();
  walk(ast, (node: any) => {
    const name = isThemeRule(node);
    if (name && name !== "system") {
      themes.set(`${name}Theme`, importTheme(node));
    }
  });
  return themes;
}

function importTheme(ast: any) {
  let theme = new CustomTheme();
  walk(ast, (node: any) => {
    if (node.type === "Declaration") {
      const { property, value } = node;
      if (
        (themePropsMap as any)[property]?.type === "color" &&
        value.type === "Raw"
      ) {
        theme = theme.set(property, parseColor(value.value.trim()));
      }
    }
  });
  return theme;
}

function isThemeRule(node: any) {
  if (node.type !== "Rule") {
    return false;
  }
  const { prelude } = node;
  if (prelude.type !== "SelectorList" || prelude.children?.size !== 1) {
    return false;
  }
  const [selector] = prelude.children;
  if (selector.type !== "Selector" || selector.children?.size !== 2) {
    return false;
  }
  const [type, attr] = selector.children;
  if (
    type.type !== "TypeSelector" ||
    type.name !== "html" ||
    attr.type !== "AttributeSelector"
  ) {
    return false;
  }
  const { name, value } = attr;
  if (
    name.type !== "Identifier" ||
    name.name !== "data-color" ||
    value.type !== "String"
  ) {
    return false;
  }
  return value.value;
}

function formatSourceCode(themes: Map<string, CustomTheme>): string {
  const lines = new Array<string>();
  lines.push(`// Generated file, do not edit.`);
  lines.push(``);
  lines.push(`import { parseColor } from "@keybr/color";`);
  lines.push(`import { CustomTheme } from "@keybr/themes";`);
  for (const [name, theme] of themes.entries()) {
    lines.push(``);
    lines.push(`export const ${name} = new CustomTheme()`);
    for (const prop of themeProps) {
      const value = theme.get(prop);
      if (value instanceof Color) {
        const hex = value.toRgb().formatHex();
        lines.push(`  .set("${prop}", parseColor("${hex}"))`);
      }
    }
    lines.push(`;`);
  }
  lines.push(``);
  return lines.join("\n");
}

generate().catch((err) => {
  console.error(err);
});
