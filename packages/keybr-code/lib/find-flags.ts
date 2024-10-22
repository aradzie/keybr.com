import {
  isAlt,
  isCond,
  isOpt,
  isSeq,
  isSpan,
  type Prod,
  type Rules,
} from "./ast.ts";

export function findFlags(rules: Rules): Set<string> {
  const flags = new Set<string>();
  for (const rule of Object.values(rules)) {
    visit(rule);
  }
  return flags;

  function visit(p: Prod): void {
    if (isCond(p)) {
      flags.add(p.flag);
      visit(p.cond);
      return;
    }

    if (isSpan(p)) {
      visit(p.span);
      return;
    }

    if (isOpt(p)) {
      visit(p.opt);
      return;
    }

    if (isSeq(p)) {
      for (const child of p.seq) {
        visit(child);
      }
      return;
    }

    if (isAlt(p)) {
      for (const child of p.alt) {
        visit(child);
      }
      return;
    }
  }
}
