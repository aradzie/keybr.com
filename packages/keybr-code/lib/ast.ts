import { type CodePoint } from "@keybr/unicode";

export type Rules = Record<string, Prod>;

export type BaseProd = {
  // Each rule can have a list of characters that it can generate.
  // We need to know this to be able to generate sentences with already opened
  // characters.
  codePoints?: Set<number>[];
};

export type Prod = Span | Opt | Seq | Alt | Ref | string;

export type Span = BaseProd & {
  readonly cls: string;
  readonly span: Prod;
};

export type Opt = BaseProd & {
  readonly f: number;
  readonly opt: Prod;
};

export type Seq = BaseProd & {
  readonly seq: readonly Prod[];
};

export type Alt = BaseProd & {
  readonly alt: readonly Prod[];
};

export type Ref = BaseProd & {
  readonly ref: string;
};

export function isSpan(v: Prod): v is Span {
  return typeof v === "object" && "span" in v;
}

export function isOpt(v: Prod): v is Opt {
  return typeof v === "object" && "opt" in v;
}

export function isSeq(v: Prod): v is Seq {
  return typeof v === "object" && "seq" in v;
}

export function isAlt(v: Prod): v is Alt {
  return typeof v === "object" && "alt" in v;
}

export function isRef(v: Prod): v is Ref {
  return typeof v === "object" && "ref" in v;
}

export function isLit(v: Prod): v is string {
  return typeof v === "string";
}

export function hasCodePoints(v: unknown): v is BaseProd {
  return v != null && typeof v === "object" && "codePoints" in v;
}

export function withCodePoints(start: string, rules: Rules): Rules {
  let firstRule = getRule(start);
  if (!isLit(firstRule)) {
    firstRule.codePoints = visit(firstRule);
  }
  return rules;

  function visit(p: Prod): Set<CodePoint>[] {
    if (hasCodePoints(p) && p.codePoints != null) {
      return p.codePoints;
    }

    if (isSpan(p)) {
      p.codePoints = visit(p.span);
      return p.codePoints;
    }

    if (isOpt(p)) {
      p.codePoints = [new Set<CodePoint>(), ...visit(p.opt)];
      return p.codePoints;
    }

    if (isSeq(p)) {
      // To be precise it should generate all combinations of the sequences.
      // But this seems to be overkill, so we just generate one set of all
      // characters possible in the sequence.
      let codePoints = new Set<CodePoint>();
      for (const child of p.seq) {
        codePoints = visit(child).reduce(
          (acc, cp) => new Set([...cp, ...acc]),
          codePoints,
        );
      }
      p.codePoints = [codePoints];
      return p.codePoints;
    }

    if (isAlt(p)) {
      let codePoints: Set<CodePoint>[] = [];
      for (const child of p.alt) {
        codePoints = codePoints.concat(visit(child));
      }
      p.codePoints = codePoints;
      return p.codePoints;
    }

    if (isRef(p)) {
      p.codePoints = visit(getRule(p.ref));
      return p.codePoints;
    }

    if (isLit(p)) {
      return [new Set([...p].map((c) => c.charCodeAt(0)))];
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
}
