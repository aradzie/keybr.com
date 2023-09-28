import { type Keyboard } from "@keybr/keyboard";
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
  row: ReadonlySet<string>,
): number {
  let a = 0;
  let b = 0;
  for (const { codePoint, f } of letters) {
    const keyCombo = keyboard.getKeyCombo(codePoint);
    if (keyCombo) {
      if (row.has(keyCombo.key.id)) {
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
  leftKeys: ReadonlySet<string>,
  rightKeys: ReadonlySet<string>,
): number {
  let a = 0;
  let b = 0;
  for (const { codePoint0, codePoint1, frequency } of bigrams) {
    const key0 = keyboard.getKeyCombo(codePoint0);
    const key1 = keyboard.getKeyCombo(codePoint1);
    if (key0 && key1) {
      if (
        (leftKeys.has(key0.key.id) && rightKeys.has(key1.key.id)) ||
        (rightKeys.has(key0.key.id) && leftKeys.has(key1.key.id))
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
    const key0 = keyboard.getKeyCombo(codePoint0);
    const key1 = keyboard.getKeyCombo(codePoint1);
    if (key0 && key1) {
      if (key0.key.geometry.zone !== key1.key.geometry.zone) {
        a += frequency;
      } else {
        b += frequency;
      }
    }
  }
  return a / (a + b);
}
