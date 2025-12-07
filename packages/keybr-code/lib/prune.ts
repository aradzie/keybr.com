import {
  type Grammar,
  isAlt,
  isCond,
  isLit,
  isOpt,
  isRef,
  isSeq,
  isSpan,
  type Prod,
  type Rules,
} from "./ast.ts";
import { type Flags } from "./flags.ts";

/**
 * Returns a cloned grammar in which all unreachable conditional branches are removed.
 */
export function pruneCond({ rules, composes }: Grammar, flags: Flags): Grammar {
  return {
    rules: visitRules(rules),
    composes: composes.map((grammar) => pruneCond(grammar, flags)),
  };

  function visitRules(rules: Rules): Rules {
    const result: Rules = {};
    for (const [name, rule] of Object.entries(rules)) {
      result[name] = visit(rule) ?? "";
    }
    return result;
  }

  function visit(p: Prod): Prod | null {
    if (isCond(p)) {
      if (flags.has(p.flag) !== p.inv) {
        return p.cond;
      }
      return null;
    }

    if (isSpan(p)) {
      const span = visit(p.span);
      if (span != null) {
        return { cls: p.cls, span };
      }
      return null;
    }

    if (isOpt(p)) {
      const opt = visit(p.opt);
      if (opt != null) {
        return { f: p.f, opt };
      }
      return null;
    }

    if (isSeq(p)) {
      const seq: Prod[] = [];
      for (const item of p.seq) {
        const pruned = visit(item);
        if (pruned != null) {
          seq.push(pruned);
        }
      }
      if (seq.length > 0) {
        return { seq };
      }
      return null;
    }

    if (isAlt(p)) {
      const alt: Prod[] = [];
      for (const item of p.alt) {
        const pruned = visit(item);
        if (pruned != null) {
          alt.push(pruned);
        }
      }
      if (alt.length > 0) {
        return { alt };
      }
      return null;
    }

    if (isRef(p)) {
      return p;
    }

    if (isLit(p)) {
      return p;
    }

    throw new Error(`Invalid element`);
  }
}
