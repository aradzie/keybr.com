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
import { Output } from "./output.ts";

const lcg = LCG(1);

/**
 * Generates text from the given context-free grammar.
 */
export function generate(
  rules: Rules,
  start: string = "start",
  {
    output = new Output(),
    rng = lcg,
  }: {
    readonly output?: Output;
    readonly rng?: RNG;
  } = {},
): string {
  const alts = new Map<readonly Prod[], Prod>();
  visit(getRule(start));
  return String(output);

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
      output.append(p);
      return;
    }

    throw new Error(); // Unreachable.
  }

  function getRule(name: string): Prod {
    const rule = rules[name];
    if (rule == null) {
      throw new Error(
        process.env.NODE_ENV !== "production"
          ? `Unknown rule [${name}]`
          : undefined,
      );
    }
    return rule;
  }

  function choose(a: readonly Prod[]): Prod {
    if (a.length > 1) {
      const prev = alts.get(a);
      while (true) {
        const next = a[Math.floor(rng() * a.length)];
        if (prev !== next) {
          alts.set(a, next);
          return next;
        }
      }
    } else {
      return a[0];
    }
  }
}
