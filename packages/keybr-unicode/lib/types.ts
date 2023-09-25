export type CodePoint = number;

export type CharCode = number;

export type CodePointSet = {
  has(codePoint: CodePoint): boolean;
};

export type CharCodeSet = {
  has(charCode: CharCode): boolean;
};
