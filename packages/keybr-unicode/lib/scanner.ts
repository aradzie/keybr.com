import { charCount } from "./codepoints.ts";
import { type CodePoint } from "./types.ts";

export type Predicate = CodePoint | ((codePoint: CodePoint) => boolean);

export type Scanner = {
  readonly text: string;
  readonly index: number;
  readonly end: boolean;
  reset(): void;
  next(): CodePoint;
  lookAhead(offset: number): CodePoint;
  consume(test: Predicate): boolean;
};

export const newScanner = (text: string): Scanner => {
  text = text.normalize("NFC");
  const { length } = text;
  let index = 0;

  return new (class implements Scanner {
    get text(): string {
      return text;
    }

    get index(): number {
      return index;
    }

    get end(): boolean {
      return index === length;
    }

    reset(): void {
      index = 0;
    }

    next(): CodePoint {
      if (index >= length) {
        return -1;
      }
      const codePoint = text.codePointAt(index) ?? 0;
      index += charCount(codePoint);
      return codePoint;
    }

    lookAhead(offset: number): CodePoint {
      let lookaheadIndex = index;
      while (true) {
        if (lookaheadIndex >= length) {
          return -1;
        }
        const codePoint = text.codePointAt(lookaheadIndex) ?? 0;
        if (offset === 0) {
          return codePoint;
        }
        lookaheadIndex += charCount(codePoint);
        offset -= 1;
      }
    }

    consume(test: Predicate): boolean {
      if (index >= length) {
        return false;
      }
      const codePoint = text.codePointAt(index) ?? 0;
      switch (typeof test) {
        case "number":
          if (codePoint === test) {
            index += charCount(codePoint);
            return true;
          }
          return false;
        case "function":
          if (test(codePoint)) {
            index += charCount(codePoint);
            return true;
          }
          return false;
        default:
          throw new TypeError();
      }
    }
  })();
};
