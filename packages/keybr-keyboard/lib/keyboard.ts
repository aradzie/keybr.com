import { type Layout } from "@keybr/layout";
import { type CodePoint } from "@keybr/unicode";
import { combineDiacritic, isDiacritic } from "./diacritics.ts";
import { KeyCharacters } from "./keycharacters.ts";
import { KeyCombo } from "./keycombo.ts";
import { KeyModifier } from "./keymodifier.ts";
import { KeyShape } from "./keyshape.ts";
import { keyWeights } from "./keyweights.ts";
import {
  type CodePointDict,
  type GeometryDict,
  type KeyId,
  type WeightedCodePointSet,
} from "./types.ts";

export class Keyboard {
  readonly characters: ReadonlyMap<KeyId, KeyCharacters>;
  readonly combos: ReadonlyMap<CodePoint, KeyCombo>;
  readonly shapes: ReadonlyMap<KeyId, KeyShape>;

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
    dead = true,
    shift = true,
    alt = true,
  }: {
    readonly dead?: boolean;
    readonly shift?: boolean;
    readonly alt?: boolean;
  } = {}): WeightedCodePointSet {
    const list: CodePoint[] = [];
    const weights = new Map<CodePoint, number>();
    for (const combo of this.combos.values()) {
      if (
        (combo.prefix == null || dead) &&
        (!combo.shift || shift) &&
        (!combo.alt || alt)
      ) {
        list.push(combo.codePoint);
        const weight = keyWeights.get(combo.id);
        if (weight != null) {
          weights.set(combo.codePoint, weight);
        }
      }
    }
    const codePoints = new Set(list.sort((a, b) => a - b));
    return new (class implements WeightedCodePointSet {
      [Symbol.iterator](): IterableIterator<CodePoint> {
        return codePoints[Symbol.iterator]();
      }
      get size(): number {
        return codePoints.size;
      }
      has(codePoint: CodePoint): boolean {
        return codePoints.has(codePoint);
      }
      weight(codePoint: CodePoint): number {
        return weights.get(codePoint) ?? 1000;
      }
    })();
  }
}

function setCombo(map: Map<CodePoint, KeyCombo>, combo: KeyCombo): void {
  const oldCombo = map.get(combo.codePoint);
  if (oldCombo == null || oldCombo.complexity > combo.complexity) {
    map.set(combo.codePoint, combo);
  }
}

function addCombo(
  map: Map<CodePoint, KeyCombo>,
  codePoint: CodePoint,
  id: KeyId,
  modifier: KeyModifier,
): void {
  if (codePoint > 0 && !isDiacritic(codePoint)) {
    setCombo(map, new KeyCombo(codePoint, id, modifier));
  }
}

function addDeadCombo(
  map: Map<CodePoint, KeyCombo>,
  codePoint: CodePoint,
  id: KeyId,
  modifier: KeyModifier,
): void {
  if (codePoint > 0 && isDiacritic(codePoint)) {
    const prefix = new KeyCombo(codePoint, id, modifier);
    for (const combo of map.values()) {
      if (combo.prefix == null) {
        const combinedCodePoint = combineDiacritic(combo.codePoint, codePoint);
        if (combinedCodePoint !== combo.codePoint) {
          setCombo(
            map,
            new KeyCombo(combinedCodePoint, combo.id, combo.modifier, prefix),
          );
        }
      }
    }
  }
}
