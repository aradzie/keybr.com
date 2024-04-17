import {
  type Alt,
  isAlt,
  isLit,
  isOpt,
  isSeq,
  isSpan,
  type Opt,
  type Prod,
  type Rules,
  type Seq,
  type Span,
} from "./ast.ts";

/**
 * Returns an optimized copy of the given grammar.
 *
 * - Empty `seq`s are removed.
 * - Empty `alts`s are removed.
 * - Consecutive `seq`s are joined.
 * - Nested `seq`s are flattened.
 * - Nested `alt`s are flattened.
 * - Deterministic `opt`s are removed.
 */
export function optimize(rules: Rules): Rules {
  return Object.fromEntries(
    Object.entries(rules).map(([name, rule]) => [name, visit(rule)]),
  );
}

function visit(p: Prod): Prod {
  if (isSpan(p)) {
    return visitSpan(p);
  }

  if (isOpt(p)) {
    return visitOpt(p);
  }

  if (isSeq(p)) {
    return visitSeq(p);
  }

  if (isAlt(p)) {
    return visitAlt(p);
  }

  return p;
}

function visitSpan(v: Span): Prod {
  const { cls, span } = v;
  return { cls, span: visit(span) };
}

function visitOpt(v: Opt): Prod {
  const { f, opt } = v;
  if (f === 1) {
    return visit(opt);
  } else {
    return { f, opt: visit(opt) };
  }
}

function visitSeq(v: Seq): Prod {
  const seq: Prod[] = [];
  step(v);
  if (seq.length === 1) {
    return seq[0];
  } else {
    return { ...v, seq };
  }

  function step(p: Seq): void {
    for (const child of p.seq) {
      if (isSeq(child)) {
        step(child);
      } else {
        push(visit(child));
      }
    }
  }

  function push(p: Prod): void {
    if (!isEmpty(p)) {
      if (isLit(p) && seq.length > 0 && isLit(seq[seq.length - 1])) {
        seq.push(String(seq.pop()) + p);
      } else {
        seq.push(p);
      }
    }
  }
}

function visitAlt(v: Alt): Prod {
  const alt: Prod[] = [];
  step(v);
  if (alt.length === 1) {
    return alt[0];
  } else {
    return { ...v, alt };
  }

  function step(p: Alt): void {
    for (const child of p.alt) {
      if (isAlt(child)) {
        step(child);
      } else {
        push(visit(child));
      }
    }
  }

  function push(p: Prod): void {
    if (!isEmpty(p)) {
      alt.push(p);
    }
  }
}

export function isEmpty(p: Prod): boolean {
  if (isSeq(p)) {
    return p.seq.length === 0;
  }

  if (isAlt(p)) {
    return p.alt.length === 0;
  }

  return false;
}
