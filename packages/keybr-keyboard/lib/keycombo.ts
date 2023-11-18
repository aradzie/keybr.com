import { KeyModifier } from "./keymodifier.ts";
import { type CodePoint, type HasCodePoint, type KeyId } from "./types.ts";

export class KeyCombo implements HasCodePoint {
  readonly complexity: number;
  readonly usesShift: boolean;
  readonly usesAlt: boolean;

  constructor(
    readonly codePoint: CodePoint,
    readonly id: KeyId,
    readonly modifier: KeyModifier,
    readonly prefix: KeyCombo | null = null,
  ) {
    let complexity = 0;
    let usesShift = false;
    let usesAlt = false;
    let combo: KeyCombo | null = this; // eslint-disable-line
    while (combo != null) {
      const { modifier } = combo;
      complexity += 1 + KeyModifier.complexity(modifier);
      usesShift ||= KeyModifier.usesShift(modifier);
      usesAlt ||= KeyModifier.usesAlt(modifier);
      combo = combo.prefix;
    }
    this.complexity = complexity;
    this.usesShift = usesShift;
    this.usesAlt = usesAlt;
  }
}
