export type Grammar = {
  readonly rule: RuleMap;
};

export type RuleMap = {
  readonly [name: string]: Prod;
};

export type Prod = Span | Opt | Seq | Alt | Ref | string;

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
