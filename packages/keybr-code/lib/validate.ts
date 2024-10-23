import {
  findRule,
  type Grammar,
  isAlt,
  isCond,
  isLit,
  isOpt,
  isRef,
  isSeq,
  isSpan,
  type Prod,
} from "./ast.ts";

/**
 * Checks that the given grammar is valid.
 *
 * - Checks that there are no empty `seq`s.
 * - Checks that there are no empty `alt`s.
 * - Checks that all refs can be resolved.
 * - Checks that there are no unreferenced rules.
 */
export function validate(grammar: Grammar): Grammar {
  const referenced = new Set<string>();
  referenced.add("start");
  for (const rule of Object.values(grammar.rules)) {
    visit(rule);
  }
  for (const name of Object.keys(grammar.rules)) {
    if (!name.startsWith("start_") && !referenced.has(name)) {
      throw new Error(`Unreferenced rule <${name}>`);
    }
  }
  return grammar;

  function visit(p: Prod): void {
    if (isCond(p)) {
      visit(p.cond);
      return;
    }

    if (isSpan(p)) {
      visit(p.span);
      return;
    }

    if (isOpt(p)) {
      const { f, opt } = p;
      if (f < 0 || f > 1) {
        throw new Error(`Invalid opt probability ${f}`);
      }
      visit(opt);
      return;
    }

    if (isSeq(p)) {
      const { seq } = p;
      if (seq.length === 0) {
        throw new Error(`Empty seq`);
      }
      for (const child of seq) {
        visit(child);
      }
      return;
    }

    if (isAlt(p)) {
      const { alt } = p;
      if (alt.length === 0) {
        throw new Error(`Empty alt`);
      }
      for (const child of alt) {
        visit(child);
      }
      return;
    }

    if (isRef(p)) {
      const { ref } = p;
      if (findRule(grammar, ref) == null) {
        throw new Error(`Invalid ref <${ref}>`);
      }
      referenced.add(ref);
      return;
    }

    if (isLit(p)) {
      return;
    }

    throw new Error(`Invalid element`);
  }
}
