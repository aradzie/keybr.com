import {
  type CodePoint,
  type Keyboard,
  type KeyId,
  type KeyShape,
} from "@keybr/keyboard";
import { type Letter } from "@keybr/phonetic-model";

export class Bigram {
  constructor(
    readonly codePoint0: number,
    readonly codePoint1: number,
    readonly frequency: number,
  ) {}
}

export function keysOnRow(
  letters: readonly Letter[],
  keyboard: Keyboard,
  row: ReadonlySet<KeyId>,
): number {
  let a = 0;
  let b = 0;
  for (const { codePoint, f } of letters) {
    const key = getShape(keyboard, codePoint);
    if (key != null) {
      if (row.has(key.id)) {
        a += f;
      } else {
        b += f;
      }
    }
  }
  return a / (a + b);
}

export function handSwitches(
  bigrams: readonly Bigram[],
  keyboard: Keyboard,
  leftKeys: ReadonlySet<KeyId>,
  rightKeys: ReadonlySet<KeyId>,
): number {
  let a = 0;
  let b = 0;
  for (const { codePoint0, codePoint1, frequency } of bigrams) {
    const key0 = getShape(keyboard, codePoint0);
    const key1 = getShape(keyboard, codePoint1);
    if (key0 != null && key1 != null) {
      if (
        (leftKeys.has(key0.id) && rightKeys.has(key1.id)) ||
        (rightKeys.has(key0.id) && leftKeys.has(key1.id))
      ) {
        a += frequency;
      } else {
        b += frequency;
      }
    }
  }
  return a / (a + b);
}

export function fingerSwitches(
  bigrams: readonly Bigram[],
  keyboard: Keyboard,
): number {
  let a = 0;
  let b = 0;
  for (const { codePoint0, codePoint1, frequency } of bigrams) {
    const key0 = getShape(keyboard, codePoint0);
    const key1 = getShape(keyboard, codePoint1);
    if (key0 != null && key1 != null) {
      if (key0.finger !== key1.finger) {
        a += frequency;
      } else {
        b += frequency;
      }
    }
  }
  return a / (a + b);
}

function getShape(keyboard: Keyboard, codePoint: CodePoint): KeyShape | null {
  const combo = keyboard.getCombo(codePoint);
  return combo == null ? null : keyboard.getShape(combo.id);
}
