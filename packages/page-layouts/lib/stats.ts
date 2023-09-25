import { type Keyboard } from "@keybr/keyboard";
import { type Letter } from "@keybr/phonetic-model";

export class Transition {
  constructor(
    public readonly fromCodePoint: number,
    public readonly toCodePoint: number,
    public readonly frequency: number,
  ) {
    Object.freeze(this);
  }
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
  transitions: readonly Transition[],
  keyboard: Keyboard,
  leftKeys: ReadonlySet<string>,
  rightKeys: ReadonlySet<string>,
): number {
  let a = 0;
  let b = 0;
  for (const { fromCodePoint, toCodePoint, frequency } of transitions) {
    const fromKey = keyboard.getKeyCombo(fromCodePoint);
    const toKey = keyboard.getKeyCombo(toCodePoint);
    if (fromKey && toKey) {
      if (
        (leftKeys.has(fromKey.key.id) && rightKeys.has(toKey.key.id)) ||
        (rightKeys.has(fromKey.key.id) && leftKeys.has(toKey.key.id))
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
  transitions: readonly Transition[],
  keyboard: Keyboard,
): number {
  let a = 0;
  let b = 0;
  for (const { fromCodePoint, toCodePoint, frequency } of transitions) {
    const fromKey = keyboard.getKeyCombo(fromCodePoint);
    const toKey = keyboard.getKeyCombo(toCodePoint);
    if (fromKey && toKey) {
      if (fromKey.key.geometry.zone !== toKey.key.geometry.zone) {
        a += frequency;
      } else {
        b += frequency;
      }
    }
  }
  return a / (a + b);
}
