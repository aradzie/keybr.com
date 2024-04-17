import {
  type Grammar,
  isAlt,
  isLit,
  isOpt,
  isRef,
  isSeq,
  isSpan,
  type Prod,
} from "./ast.ts";

export type Options = {
  readonly start?: string;
  readonly random?: () => number;
};

/**
 * Generates text from the given context-free grammar.
 */
export function generate(grammar: Grammar, options: Options = {}): string {
  const {
    start = "start", // The default start.
    random = Math.random, // The default RNG.
  } = options;

  const { rule } = grammar;
  const rulesByName = new Map(Object.entries(rule));
  const result: string[] = [];
  visit(getRule(start));
  return result.join("");

  function visit(p: Prod): void {
    if (isSpan(p)) {
      visit(p.span);
      return;
    }

    if (isOpt(p)) {
      const { f = 1 } = p;
      if (f === 1 || f > random()) {
        visit(p.opt);
      }
      return;
    }

    if (isSeq(p)) {
      for (const child of p.seq) {
        visit(child);
      }
      return;
    }

    if (isAlt(p)) {
      visit(choose(p.alt));
      return;
    }

    if (isRef(p)) {
      visit(getRule(p.ref));
      return;
    }

    if (isLit(p)) {
      result.push(p);
      return;
    }

    throw new Error(); // Unreachable.
  }

  function getRule(name: string): Prod {
    const rule = rulesByName.get(name);
    if (rule == null) {
      throw new Error(`Unknown rule [${name}]`);
    }
    return rule;
  }

  function choose(a: readonly Prod[]): Prod {
    return a[Math.floor(random() * a.length)];
  }
}
