import { Enum, type EnumItem } from "@keybr/lang";
import { type RNG } from "@keybr/rand";
import { type StyledText } from "@keybr/textinput";
import { type Grammar } from "./ast.ts";
import { findFlags } from "./find-flags.ts";
import { type Flags } from "./flags.ts";
import { generate } from "./generate.ts";
import { Output } from "./output.ts";
import {
  grammar_cpp,
  grammar_html_css,
  grammar_javascript,
  grammar_python,
  grammar_regex,
  grammar_rust,
  grammar_shell,
} from "./syntax/grammars.ts";
import { validate } from "./validate.ts";

export class Syntax implements EnumItem {
  static readonly HTML = new Syntax("html", "HTML", grammar_html_css, "html");
  static readonly CSS = new Syntax("css", "CSS", grammar_html_css, "css");
  static readonly CPP = new Syntax("cpp", "C/C++", grammar_cpp);
  static readonly CPP_FPROTO = new Syntax(
    "cpp_fproto",
    "C/C++ Function Prototypes",
    grammar_cpp,
    "start_fproto",
  );
  static readonly CPP_STMT = new Syntax(
    "cpp_stmt",
    "C/C++ Statements",
    grammar_cpp,
    "start_stmt",
  );
  static readonly JAVASCRIPT_EXP = new Syntax(
    "javascript_exp",
    "Java Script Expressions",
    grammar_javascript,
  );
  static readonly PYTHON = new Syntax("python", "Python", grammar_python);
  static readonly RUST = new Syntax("rust", "Rust", grammar_rust);
  static readonly SHELL = new Syntax("shell", "Shell", grammar_shell);
  static readonly REGEX = new Syntax("regex", "Regex", grammar_regex);

  static readonly ALL = new Enum<Syntax>(
    Syntax.HTML,
    Syntax.CSS,
    Syntax.CPP,
    Syntax.CPP_FPROTO,
    Syntax.CPP_STMT,
    Syntax.JAVASCRIPT_EXP,
    Syntax.PYTHON,
    Syntax.RUST,
    Syntax.SHELL,
    Syntax.REGEX,
  );

  readonly id: string;
  readonly name: string;
  readonly grammar: Grammar;
  readonly start: string;
  readonly flags: ReadonlySet<string>;

  private constructor(
    id: string,
    name: string,
    grammar: Grammar,
    start: string = "start",
  ) {
    this.id = id;
    this.name = name;
    this.grammar = validate(grammar);
    this.start = start;
    this.flags = findFlags(grammar.rules);
    Object.freeze(this);
  }

  generate(flags: Flags, rng?: RNG): StyledText {
    const output = new Output(200);
    while (true) {
      try {
        if (output.length > 0) {
          output.separate(" ");
        }
        generate(this.grammar, { start: this.start, flags, output, rng });
      } catch (err) {
        if (err === Output.Stop) {
          break;
        } else {
          throw err;
        }
      }
    }
    return output.text;
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}
