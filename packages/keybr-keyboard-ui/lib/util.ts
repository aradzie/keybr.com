import { type Keyboard, type KeyboardKey } from "@keybr/keyboard";
import { type Letter } from "@keybr/phonetic-model";

export const visualSort = (a: KeyboardKey, b: KeyboardKey): number => {
  return a.geometry.y - b.geometry.y || a.geometry.x - b.geometry.x;
};

export const getKeyboardKeys = (keyboard: Keyboard): KeyboardKey[] => {
  return [
    ...keyboard.keys,
    ...keyboard.specialKeys,
    ...keyboard.extraKeys,
  ].sort(visualSort);
};

export type KeyFrequency = [
  /* Keyboard key. */
  key: KeyboardKey,
  /* Relative key frequency, [0-1]. */
  frequency: number,
];

export const keyFrequencies = (
  keyboard: Keyboard,
  histogram: ReadonlyMap<Letter, number>,
): KeyFrequency[] => {
  const list: KeyFrequency[] = [];
  let min = 0;
  let max = 0;
  for (const [{ codePoint }, count] of histogram) {
    if (count > 0) {
      const keyCombo = keyboard.getKeyCombo(codePoint);
      if (keyCombo != null && keyCombo.prefix == null) {
        if (list.length === 0) {
          min = count;
          max = count;
        } else {
          min = Math.min(min, count);
          max = Math.max(max, count);
        }
        list.push([keyCombo.key, count]);
      }
    }
  }
  return list
    .sort(([a], [b]) => visualSort(a, b))
    .map(([key, count]) =>
      max === min ? [key, 1] : [key, (count - min) / (max - min)],
    );
};
