import { type CodePoint, toCodePoints } from "@keybr/unicode";
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

export function collectCodePoints(rules: Rules): void {
  for (const rule of Object.values(rules)) {
    visit(rule);
  }

  function visit(p: Prod | null): ReadonlySet<CodePoint> {
    if (p == null) {
      return new Set();
    }

    if (isSpan(p)) {
      if (p.codePoints != null) {
        return p.codePoints;
      }
      return (p.codePoints = visit(p.span));
    }

    if (isOpt(p)) {
      if (p.codePoints != null) {
        return p.codePoints;
      }
      return (p.codePoints = visit(p.opt));
    }

    if (isSeq(p)) {
      if (p.codePoints != null) {
        return p.codePoints;
      }
      const codePoints = new Set<CodePoint>();
      for (const child of p.seq) {
        addAll(codePoints, visit(child));
      }
      return (p.codePoints = codePoints);
    }

    if (isAlt(p)) {
      if (p.codePoints != null) {
        return p.codePoints;
      }
      const codePoints = new Set<CodePoint>();
      for (const child of p.alt) {
        addAll(codePoints, visit(child));
      }
      return (p.codePoints = codePoints);
    }

    if (isRef(p)) {
      if (p.codePoints != null) {
        return p.codePoints;
      }
      return (p.codePoints = visit(rules[p.ref]));
    }

    if (isLit(p)) {
      return new Set(toCodePoints(p));
    }

    throw new Error(); // Unreachable.
  }
}

function addAll<T>(set: Set<T>, items: Iterable<T>): Set<T> {
  for (const item of items) {
    set.add(item);
  }
  return set;
}
