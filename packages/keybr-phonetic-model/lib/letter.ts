import { type CodePoint, type CodePointSet } from "@keybr/unicode";

export type HasLetter = {
  readonly letter: Letter;
};

export type LetterLike = Letter | HasLetter;

export class Letter {
  /** Letter string. */
  public readonly value: string;
  /** Letter display label. */
  public readonly label: string;

  /**
   * @param codePoint Unicode character code point.
   * @param f Relative frequency.
   */
  constructor(
    readonly codePoint: CodePoint,
    readonly f: number,
  ) {
    switch (this.codePoint) {
      case /* ß */ 0x00df:
        this.value = "ß";
        this.label = "ẞ";
        break;
      default:
        this.value = String.fromCodePoint(codePoint);
        this.label = this.value.toUpperCase();
        break;
    }
  }

  toString(): string {
    return this.label;
  }
}

export namespace Letter {
  export const plus = new Letter(/* + */ 0x002b, 1.0);
  export const comma = new Letter(/* , */ 0x002c, 1.0);
  export const minus = new Letter(/* - */ 0x002d, 1.0);
  export const dot = new Letter(/* . */ 0x002e, 1.0);
  export const digits: readonly Letter[] = [
    new Letter(/* 0 */ 0x0030, 0.0),
    new Letter(/* 1 */ 0x0031, 0.301),
    new Letter(/* 2 */ 0x0032, 0.176),
    new Letter(/* 3 */ 0x0033, 0.125),
    new Letter(/* 4 */ 0x0034, 0.097),
    new Letter(/* 5 */ 0x0035, 0.079),
    new Letter(/* 6 */ 0x0036, 0.067),
    new Letter(/* 7 */ 0x0037, 0.058),
    new Letter(/* 8 */ 0x0038, 0.051),
    new Letter(/* 9 */ 0x0039, 0.046),
  ];
  export const punctuators: readonly Letter[] = [
    new Letter(/* , */ 0x002c, 9.0),
    new Letter(/* . */ 0x002e, 8.0),
    new Letter(/* ! */ 0x0021, 2.0),
    new Letter(/* ? */ 0x003f, 2.0),
    new Letter(/* ; */ 0x003b, 1.0),
    new Letter(/* : */ 0x003a, 1.0),
    new Letter(/* ' */ 0x0027, 1.0),
    new Letter(/* " */ 0x0022, 1.0),
    new Letter(/* - */ 0x002d, 1.0),
  ];
  export const specials: readonly Letter[] = [
    // new Letter(/* ! */ 0x0021, 1),
    // new Letter(/* " */ 0x0022, 1),
    new Letter(/* # */ 0x0023, 1),
    new Letter(/* $ */ 0x0024, 1),
    new Letter(/* % */ 0x0025, 1),
    new Letter(/* & */ 0x0026, 1),
    // new Letter(/* ' */ 0x0027, 1),
    new Letter(/* ( */ 0x0028, 1),
    new Letter(/* ) */ 0x0029, 1),
    new Letter(/* * */ 0x002a, 1),
    new Letter(/* + */ 0x002b, 1),
    // new Letter(/* , */ 0x002c, 1),
    new Letter(/* - */ 0x002d, 1),
    // new Letter(/* . */ 0x002e, 1),
    new Letter(/* / */ 0x002f, 1),
    // new Letter(/* : */ 0x003a, 1),
    // new Letter(/* ; */ 0x003b, 1),
    new Letter(/* < */ 0x003c, 1),
    new Letter(/* = */ 0x003d, 1),
    new Letter(/* > */ 0x003e, 1),
    // new Letter(/* ? */ 0x003f, 1),
    new Letter(/* @ */ 0x0040, 1),
    new Letter(/* [ */ 0x005b, 1),
    new Letter(/* \ */ 0x005c, 1),
    new Letter(/* ] */ 0x005d, 1),
    new Letter(/* ^ */ 0x005e, 1),
    new Letter(/* _ */ 0x005f, 1),
    new Letter(/* ` */ 0x0060, 1),
    new Letter(/* { */ 0x007b, 1),
    new Letter(/* | */ 0x007c, 1),
    new Letter(/* } */ 0x007d, 1),
    new Letter(/* ~ */ 0x007e, 1),
  ];

  export const codePointOf = ({ codePoint }: Letter): CodePoint => {
    return codePoint;
  };

  export const toLetter = (letter: LetterLike): Letter => {
    return "letter" in letter ? letter.letter : letter;
  };

  export const codePointOrder = (letters: readonly Letter[]): Letter[] => {
    return [...letters].sort((a, b) => a.codePoint - b.codePoint);
  };

  export const frequencyOrder = (letters: readonly Letter[]): Letter[] => {
    return [...letters].sort((a, b) => b.f - a.f || a.codePoint - b.codePoint);
  };

  export const restrict = (
    letters: readonly Letter[],
    codePoints: CodePointSet,
  ): Letter[] => {
    return letters.filter(({ codePoint }) => codePoints.has(codePoint));
  };

  export const normalize = (letters: readonly Letter[]): Letter[] => {
    const sum = letters.reduce((sum, { f }) => sum + f, 0);
    return letters.map(
      ({ codePoint, f }) => new Letter(codePoint, sum > 0 ? f / sum : 0),
    );
  };
}
