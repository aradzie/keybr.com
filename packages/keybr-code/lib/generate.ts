import { LCG, type RNG } from "@keybr/rand";
import {
  isAlt,
  isLit,
  isOpt,
  isRef,
  isSeq,
  isSpan,
  type Prod,
  type Rules,
} from "./ast.ts";

const lcg = LCG(1);

/**
 * Generates text from the given context-free grammar.
 */
export function generate(
  rules: Rules,
  start: string = "start",
  { rng = lcg }: { readonly rng?: RNG } = {},
): string {
  const rulesByName = new Map(Object.entries(rules));
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
      if (f === 1 || f > rng()) {
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
    return a[Math.floor(rng() * a.length)];
  }
}
