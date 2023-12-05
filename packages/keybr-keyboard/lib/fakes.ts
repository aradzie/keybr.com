import { type CodePoint, isCodePoint, toCodePoints } from "@keybr/unicode";
import { type WeightedCodePointSet } from "./types.ts";

export function allCodePoints(): WeightedCodePointSet {
  const begin = 0x0000;
  const end = 0xffff; // For tests, it is enough to have BMP code points only.
  return new (class implements WeightedCodePointSet {
    *[Symbol.iterator](): IterableIterator<CodePoint> {
      for (let i = begin; i <= end; i++) {
        yield i;
      }
    }

    get size(): number {
      return end - begin + 1;
    }

    has(codePoint: CodePoint): boolean {
      if (!isCodePoint(codePoint)) {
        throw new TypeError();
      }
      return codePoint >= begin && codePoint <= end;
    }

    weight(codePoint: CodePoint): number {
      if (!isCodePoint(codePoint)) {
        throw new TypeError();
      }
      return 1;
    }
  })();
}

export function codePointsFrom(
  alphabet: string | readonly CodePoint[],
): WeightedCodePointSet {
  const set = new Set(
    typeof alphabet === "string" ? toCodePoints(alphabet) : alphabet,
  );
  return new (class implements WeightedCodePointSet {
    [Symbol.iterator](): IterableIterator<CodePoint> {
      return set[Symbol.iterator]();
    }

    get size(): number {
      return set.size;
    }

    has(codePoint: CodePoint): boolean {
      if (!isCodePoint(codePoint)) {
        throw new TypeError();
      }
      return set.has(codePoint);
    }

    weight(codePoint: CodePoint): number {
      if (!isCodePoint(codePoint)) {
        throw new TypeError();
      }
      return 1;
    }
  })();
}
