export type CodePoint = number;

export type CodePointSet = {
  has(codePoint: CodePoint): boolean;
};

export type HasCodePoint = {
  readonly codePoint: CodePoint;
};
