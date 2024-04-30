import { Enum, type EnumItem } from "@keybr/lang";
import { type RNG } from "@keybr/rand";
import { type Rules } from "./ast.ts";
import { generate } from "./generate.ts";
import { Output } from "./output.ts";
import lang_cpp from "./syntax/lang_cpp.ts";
import lang_html_css from "./syntax/lang_html_css.ts";
import lang_javascript from "./syntax/lang_javascript.ts";
import lang_rust from "./syntax/lang_rust.ts";
import lang_shell from "./syntax/lang_shell.ts";

export class Syntax implements EnumItem {
  static readonly CPP = new Syntax(
    "cpp", //
    "C/C++",
    lang_cpp,
  );
  static readonly CPP_FPROTO = new Syntax(
    "cpp_fproto", //
    "C/C++ Function Prototypes",
    lang_cpp,
    "start_fproto",
  );
  static readonly CPP_STMT = new Syntax(
    "cpp_stmt", //
    "C/C++ Statements",
    lang_cpp,
    "start_stmt",
  );
  static readonly HTML = new Syntax(
    "html", //
    "HTML",
    lang_html_css,
    "html",
  );
  static readonly CSS = new Syntax(
    "css", //
    "CSS",
    lang_html_css,
    "css",
  );
  static readonly JAVASCRIPT = new Syntax(
    "javascript", //
    "Java Script",
    lang_javascript,
  );
  static readonly RUST = new Syntax(
    "rust", //
    "Rust",
    lang_rust,
  );
  static readonly SHELL = new Syntax(
    "shell", //
    "Shell",
    lang_shell,
  );
  static readonly ALL = new Enum<Syntax>(
    Syntax.HTML,
    Syntax.CSS,
    Syntax.CPP,
    Syntax.CPP_FPROTO,
    Syntax.CPP_STMT,
    Syntax.SHELL,
  );

  private constructor(
    readonly id: string,
    readonly name: string,
    readonly rules: Rules,
    readonly start: string = "start",
  ) {
    Object.freeze(this);
  }

  generate(rng?: RNG): string {
    const output = new Output(200);
    while (true) {
      try {
        if (output.length > 0) {
          output.separate(" ");
        }
        generate(this.rules, this.start, { output, rng });
      } catch (err) {
        if (err === Output.Stop) {
          break;
        } else {
          throw err;
        }
      }
    }
    return String(output).trim();
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}
