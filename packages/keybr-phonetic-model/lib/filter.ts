import {
  type CodePoint,
  type CodePointSet,
  type HasCodePoint,
} from "@keybr/unicode";
import { Letter, type LetterLike } from "./letter.ts";

export class Filter {
  static readonly empty = new Filter(null, null);

  /**
   * Codepoints of the letters from which to generate words.
   */
  readonly codePoints: CodePointSet | null;
  /**
   * Codepoint of the letter which must appear in each generated word.
   */
  readonly focusedCodePoint: CodePoint | null;

  constructor(
    letters0: readonly LetterLike[] | null = null,
    focused0: LetterLike | null = null,
  ) {
    const letters = letters0 && letters0.map(Letter.toLetter);
    const focused = focused0 && Letter.toLetter(focused0);
    if (letters != null && letters.length === 0) {
      throw new Error();
    }
    if (letters != null && focused != null && !letters.includes(focused)) {
      throw new Error();
    }
    this.codePoints = letters && new Set(letters.map(codePointOf));
    this.focusedCodePoint = focused && codePointOf(focused);
  }

  /**
   * Returns a value indicating whether the given codepoint
   * is allowed by this filter.
   *
   * Empty filter allows all characters.
   */
  includes(codePoint: CodePoint): boolean {
    return this.codePoints == null || this.codePoints.has(codePoint);
  }
}

const codePointOf = ({ codePoint }: HasCodePoint): CodePoint => {
  return codePoint;
};
