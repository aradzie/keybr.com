import { type Layout } from "@keybr/layout";
import { type KeyboardKey } from "./keyboardkey.ts";
import { type KeyCombo } from "./keycombo.ts";
import { KeyModifier } from "./keymodifier.ts";
import { type CodePoint, type KeyId } from "./types.ts";
import { addDeadKeyCombo, addKeyCombo } from "./util.ts";

export class Keyboard {
  readonly keys: readonly KeyboardKey[];
  readonly specialKeys: readonly KeyboardKey[];
  readonly extraKeys: readonly KeyboardKey[];
  readonly keyMap: Map<KeyId, KeyboardKey>;
  readonly comboMap: Map<CodePoint, KeyCombo>;

  constructor(
    readonly layout: Layout,
    {
      keys,
      specialKeys,
      extraKeys,
    }: {
      readonly keys: readonly KeyboardKey[];
      readonly specialKeys: readonly KeyboardKey[];
      readonly extraKeys: readonly KeyboardKey[];
    },
  ) {
    this.keys = keys;
    this.specialKeys = specialKeys;
    this.extraKeys = extraKeys;

    const keyMap = new Map<KeyId, KeyboardKey>(
      keys.map((key) => [key.id, key]),
    );
    const comboMap = new Map<CodePoint, KeyCombo>();

    for (const key of keys) {
      const { a, b, c, d } = key.codePoints;
      addKeyCombo(comboMap, a, key, KeyModifier.None);
      addKeyCombo(comboMap, b, key, KeyModifier.Shift);
      addKeyCombo(comboMap, c, key, KeyModifier.Alt);
      addKeyCombo(comboMap, d, key, KeyModifier.ShiftAlt);
    }

    for (const key of keys) {
      const { a, b, c, d } = key.codePoints;
      addDeadKeyCombo(comboMap, a, key, KeyModifier.None);
      addDeadKeyCombo(comboMap, b, key, KeyModifier.Shift);
      addDeadKeyCombo(comboMap, c, key, KeyModifier.Alt);
      addDeadKeyCombo(comboMap, d, key, KeyModifier.ShiftAlt);
    }

    this.keyMap = keyMap;
    this.comboMap = comboMap;
  }

  getKey(id: KeyId): KeyboardKey | null {
    return this.keyMap.get(id) ?? null;
  }

  getKeyCombo(codePoint: CodePoint): KeyCombo | null {
    return this.comboMap.get(codePoint) ?? null;
  }

  codePoints({
    enableDeadKeys = true,
    enableShift = true,
    enableAlt = true,
  }: {
    enableDeadKeys?: boolean;
    enableShift?: boolean;
    enableAlt?: boolean;
  } = {}): Set<CodePoint> {
    const list: CodePoint[] = [];
    for (const combo of this.comboMap.values()) {
      const { codePoint, usesShift, usesAlt, prefix } = combo;
      if (
        (prefix == null || enableDeadKeys) &&
        (!usesShift || enableShift) &&
        (!usesAlt || enableAlt)
      ) {
        list.push(codePoint);
      }
    }
    return new Set(list.sort((a, b) => a - b));
  }
}
