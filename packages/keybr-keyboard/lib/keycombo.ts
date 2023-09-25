import { type KeyboardKey } from "./keyboardkey.ts";
import { KeyModifier } from "./keymodifier.ts";
import { type CodePoint } from "./types.ts";

export class KeyCombo {
  readonly complexity: number;
  readonly usesShift: boolean;
  readonly usesAlt: boolean;

  constructor(
    readonly codePoint: CodePoint,
    readonly key: KeyboardKey,
    readonly modifier: KeyModifier,
    readonly prefix: KeyCombo | null = null,
  ) {
    let complexity = 0;
    let usesShift = false;
    let usesAlt = false;
    let keyCombo: KeyCombo | null = this; // eslint-disable-line
    while (keyCombo != null) {
      const { modifier } = keyCombo;
      complexity += 1 + KeyModifier.complexity(modifier);
      usesShift ||= KeyModifier.usesShift(modifier);
      usesAlt ||= KeyModifier.usesAlt(modifier);
      keyCombo = keyCombo.prefix;
    }
    this.complexity = complexity;
    this.usesShift = usesShift;
    this.usesAlt = usesAlt;
  }
}
