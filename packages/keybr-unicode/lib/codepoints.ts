import { type CodePoint } from "./types.ts";

export const isCodePoint = (value: number): boolean =>
  Number.isSafeInteger(value) && value >= 0 && value < 0x11_0000;

export const charCount = (codePoint: CodePoint): number =>
  codePoint >= 0x01_0000 ? 2 : 1;

export const toCodePoints = (text: string): Iterable<CodePoint> => {
  const { length } = text;
  return {
    [Symbol.iterator](): IterableIterator<CodePoint> {
      let index = 0;
      const result = { done: true, value: -1 } as IteratorResult<CodePoint>;
      const iterator = {
        [Symbol.iterator](): IterableIterator<CodePoint> {
          return iterator;
        },
        next(): IteratorResult<CodePoint> {
          if (index < length) {
            const codePoint = text.codePointAt(index) ?? 0;
            index += charCount(codePoint);
            result.done = false;
            result.value = codePoint;
          } else {
            result.done = true;
            result.value = -1;
          }
          return result;
        },
      };
      return iterator;
    },
  };
};

export const codePointLength = (text: string): number => {
  const it = toCodePoints(text)[Symbol.iterator]();
  let length = 0;
  while (true) {
    const { done } = it.next();
    if (done) {
      return length;
    }
    length += 1;
  }
};
