export type CodePoint = number;

export type CodePointSet = {
  has(codePoint: CodePoint): boolean;
};
