import { type Rules } from "./ast.ts";
import { parse as peggyParse, SyntaxError } from "./parser.js";

export { SyntaxError };

export function parse(
  input: string,
  options?: { readonly grammarSource: string },
): Rules {
  return Object.fromEntries(
    peggyParse(input, options).map(({ name, p }) => [name, p]),
  );
}
