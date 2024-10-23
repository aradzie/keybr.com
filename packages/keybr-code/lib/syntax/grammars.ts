import { compose } from "../ast.ts";
import _ident from "./_ident.ts";
import _keywords from "./_keywords.ts";
import lang_cpp from "./lang_cpp.ts";
import lang_html_css from "./lang_html_css.ts";
import lang_javascript from "./lang_javascript.ts";
import lang_python from "./lang_python.ts";
import lang_regex from "./lang_regex.ts";
import lang_rust from "./lang_rust.ts";
import lang_shell from "./lang_shell.ts";

export const grammar_html_css = compose(lang_html_css, _keywords);
export const grammar_cpp = compose(lang_cpp, _keywords, _ident);
export const grammar_javascript = compose(lang_javascript, _keywords, _ident);
export const grammar_python = compose(lang_python, _keywords, _ident);
export const grammar_rust = compose(lang_rust, _keywords, _ident);
export const grammar_shell = compose(lang_shell);
export const grammar_regex = compose(lang_regex);
