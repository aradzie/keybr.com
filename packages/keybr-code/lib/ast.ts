export type Grammar = {
  readonly rules: Rules;
  readonly composes: readonly Grammar[];
};

export type Rules = Record<string, Prod>;

export type Prod = Cond | Span | Opt | Seq | Alt | Ref | string;

export type Cond = {
  readonly flag: string;
  readonly inv: boolean;
  readonly cond: Prod;
};

export type Span = {
  readonly cls: string;
  readonly span: Prod;
};

export type Opt = {
  readonly f: number;
  readonly opt: Prod;
};

export type Seq = {
  readonly seq: readonly Prod[];
};

export type Alt = {
  readonly alt: readonly Prod[];
};

export type Ref = {
  readonly ref: string;
};

export function isCond(v: Prod): v is Cond {
  return typeof v === "object" && "cond" in v;
}

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

export function compose(rules: Rules, ...rest: Rules[]): Grammar {
  return { rules, composes: rest.map((rules) => ({ rules, composes: [] })) };
}

export function findRule(grammar: Grammar, name: string): Prod | null {
  const rule = grammar.rules[name];
  if (rule != null) {
    return rule;
  }
  for (const composed of grammar.composes) {
    const rule = findRule(composed, name);
    if (rule != null) {
      return rule;
    }
  }
  return null;
}
