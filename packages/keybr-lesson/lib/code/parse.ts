import type { Grammar } from "./ast.ts";
import { parse as peggyParse, SyntaxError } from "./parser.js";

export { SyntaxError };

export function parse(
  input: string,
  options?: { readonly grammarSource: string },
): Grammar {
  const rules = peggyParse(input, options);
  return {
    rule: Object.fromEntries(rules.map(({ name, p }) => [name, p])),
  };
}
