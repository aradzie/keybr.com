import { Enum, type EnumItem } from "@keybr/lang";
import type { Grammar } from "./ast.ts";
import { lang_c } from "./lang_c.ts";
import { lang_html } from "./lang_html.ts";
import { lang_noise } from "./lang_noise.ts";

export class CodeFlavor implements EnumItem {
  static readonly HTML = new CodeFlavor("html", "HTML", {
    rule: lang_html, //
  });
  static readonly C = new CodeFlavor("c", "C/C++", {
    rule: lang_c, //
  });
  static readonly NOISE = new CodeFlavor("noise", "Noise (ASCII art)", {
    rule: lang_noise,
  });
  static readonly ALL = new Enum<CodeFlavor>(
    CodeFlavor.HTML,
    CodeFlavor.C,
    CodeFlavor.NOISE,
  );

  private constructor(
    readonly id: string,
    readonly name: string,
    readonly grammar: Grammar,
  ) {
    Object.freeze(this);
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}
