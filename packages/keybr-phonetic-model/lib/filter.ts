import { type CodePoint, type CodePointSet } from "@keybr/unicode";
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
  readonly boostedCodePoint: CodePoint | null;

  constructor(
    letters0: readonly LetterLike[] | null = null,
    boosted0: LetterLike | null = null,
  ) {
    const letters = letters0 && letters0.map(Letter.toLetter);
    const boosted = boosted0 && Letter.toLetter(boosted0);
    if (letters != null && letters.length === 0) {
      throw new Error();
    }
    if (letters != null && boosted != null && !letters.includes(boosted)) {
      throw new Error();
    }
    this.codePoints = letters && new Set(letters.map(Letter.codePointOf));
    this.boostedCodePoint = boosted && Letter.codePointOf(boosted);
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
