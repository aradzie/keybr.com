import { Enum, type EnumItem } from "@keybr/lang";
import type { Rules } from "./ast.ts";
import lang_c from "./syntax/lang_c.ts";
import lang_html from "./syntax/lang_html.ts";
import lang_noise from "./syntax/lang_noise.ts";

export class Syntax implements EnumItem {
  static readonly HTML = new Syntax("html", "HTML", lang_html);
  static readonly C = new Syntax("cpp", "C/C++", lang_c);
  static readonly NOISE = new Syntax("noise", "Noise", lang_noise);
  static readonly ALL = new Enum<Syntax>(Syntax.HTML, Syntax.C, Syntax.NOISE);

  private constructor(
    readonly id: string,
    readonly name: string,
    readonly rules: Rules,
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
