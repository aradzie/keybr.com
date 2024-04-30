import { type CodePoint, type HasCodePoint } from "@keybr/unicode";
import { type KeyModifier } from "./keymodifier.ts";
import { type KeyId } from "./types.ts";

export class KeyCombo implements HasCodePoint {
  readonly complexity: number;
  readonly shift: boolean;
  readonly alt: boolean;

  constructor(
    readonly codePoint: CodePoint,
    readonly id: KeyId,
    readonly modifier: KeyModifier,
    readonly prefix: KeyCombo | null = null,
  ) {
    let complexity = 0;
    let shift = false;
    let alt = false;
    let combo: KeyCombo | null = this; // eslint-disable-line
    while (combo != null) {
      const { modifier } = combo;
      complexity += 1 + modifier.complexity;
      shift ||= modifier.shift;
      alt ||= modifier.alt;
      combo = combo.prefix;
    }
    this.complexity = complexity;
    this.shift = shift;
    this.alt = alt;
  }
}
