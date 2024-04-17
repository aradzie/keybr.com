import { Enum, type EnumItem } from "@keybr/lang";
import type { Grammar } from "./ast.ts";
import lang_c from "./lang_c.ts";
import lang_html from "./lang_html.ts";
import lang_noise from "./lang_noise.ts";

export class Syntax implements EnumItem {
  static readonly HTML = new Syntax("html", "HTML", lang_html);
  static readonly C = new Syntax("cpp", "C/C++", lang_c);
  static readonly NOISE = new Syntax("noise", "Noise", lang_noise);
  static readonly ALL = new Enum<Syntax>(Syntax.HTML, Syntax.C, Syntax.NOISE);

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
