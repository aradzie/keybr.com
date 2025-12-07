import { LCG, type RNG } from "@keybr/rand";
import { type StyledText } from "@keybr/textinput";
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
import { Output } from "./output.ts";

const lcg = LCG(1);

/**
 * Generates text from the given context-free grammar.
 */
export function generate(
  grammar: Grammar,
  {
    start = "start",
    output = new Output(),
    rng = lcg,
  }: {
    readonly start?: string;
    readonly output?: Output;
    readonly rng?: RNG;
  } = {},
): StyledText {
  const cls = new Array<string>();
  const alts = new Map<readonly Prod[], Prod>();
  visit(getRule(start));
  return output.text;

  function visit(p: Prod): void {
    if (isCond(p)) {
      throw new Error(); // The grammar must be pruned at this point.
    }

    if (isSpan(p)) {
      cls.push(p.cls);
      visit(p.span);
      cls.pop();
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
      output.append(p, cls.length > 0 ? cls.at(-1) : null);
      return;
    }

    throw new Error(); // Unreachable.
  }

  function getRule(name: string): Prod {
    const rule = findRule(grammar, name);
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
