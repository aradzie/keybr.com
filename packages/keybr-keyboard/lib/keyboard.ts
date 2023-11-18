import { type Layout } from "@keybr/layout";
import { KeyCharacters } from "./keycharacters.ts";
import { type KeyCombo } from "./keycombo.ts";
import { KeyModifier } from "./keymodifier.ts";
import { KeyShape } from "./keyshape.ts";
import {
  type CodePoint,
  type CodePointDict,
  type GeometryDict,
  type KeyId,
} from "./types.ts";
import { addCombo, addDeadCombo } from "./util.ts";

export class Keyboard {
  readonly characters: Map<KeyId, KeyCharacters>;
  readonly combos: Map<CodePoint, KeyCombo>;
  readonly shapes: Map<KeyId, KeyShape>;

  constructor(
    readonly layout: Layout,
    readonly codePointDict: CodePointDict,
    readonly geometryDict: GeometryDict,
  ) {
    const characters = new Map<KeyId, KeyCharacters>();
    const combos = new Map<CodePoint, KeyCombo>();
    const shapes = new Map<KeyId, KeyShape>();

    for (const [id, codePoints] of Object.entries(codePointDict)) {
      const [a = 0, b = 0, c = 0, d = 0] = codePoints;
      characters.set(id, new KeyCharacters(id, a, b, c, d));
    }

    for (const { id, a, b, c, d } of characters.values()) {
      addCombo(combos, a, id, KeyModifier.None);
      addCombo(combos, b, id, KeyModifier.Shift);
      addCombo(combos, c, id, KeyModifier.Alt);
      addCombo(combos, d, id, KeyModifier.ShiftAlt);
    }

    for (const { id, a, b, c, d } of characters.values()) {
      addDeadCombo(combos, a, id, KeyModifier.None);
      addDeadCombo(combos, b, id, KeyModifier.Shift);
      addDeadCombo(combos, c, id, KeyModifier.Alt);
      addDeadCombo(combos, d, id, KeyModifier.ShiftAlt);
    }

    for (const [id, data] of Object.entries(geometryDict)) {
      shapes.set(id, new KeyShape(id, data, codePointDict[id] ?? null));
    }

    this.characters = characters;
    this.combos = combos;
    this.shapes = shapes;
  }

  getCharacters(id: KeyId): KeyCharacters | null {
    return this.characters.get(id) ?? null;
  }

  getCombo(codePoint: CodePoint): KeyCombo | null {
    return this.combos.get(codePoint) ?? null;
  }

  getShape(id: KeyId): KeyShape | null {
    return this.shapes.get(id) ?? null;
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
    for (const combo of this.combos.values()) {
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
