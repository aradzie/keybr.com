import { type Prod, type Rules } from "./ast.ts";
import { parse as parse0, SyntaxError } from "./parser.js";

export { SyntaxError };

export function parse(
  input: string,
  options?: { readonly grammarSource: string },
): Rules {
  return Object.fromEntries(
    (parse0(input, options) as { name: string; p: Prod }[]).map(
      ({ name, p }) => [name, p],
    ),
  );
}
