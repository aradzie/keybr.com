import { type CodePoint, combineDiacritic, isDiacritic } from "@keybr/unicode";
import { type Geometry } from "./geometry.ts";
import { KeyCharacters } from "./keycharacters.ts";
import { KeyCombo } from "./keycombo.ts";
import { KeyModifier } from "./keymodifier.ts";
import { KeyShape } from "./keyshape.ts";
import { getExampleLetters, getExampleText } from "./language.ts";
import { type Layout } from "./layout.ts";
import {
  type CharacterDict,
  type DeadCharacter,
  type GeometryDict,
  type KeyId,
  type WeightedCodePointSet,
  type ZoneFilter,
  type ZoneId,
} from "./types.ts";

export class Keyboard {
  readonly characters: ReadonlyMap<KeyId, KeyCharacters>;
  readonly combos: ReadonlyMap<CodePoint, KeyCombo>;
  readonly shapes: ReadonlyMap<KeyId, KeyShape>;
  readonly zones: ReadonlyMap<ZoneId, readonly KeyShape[]>;

  constructor(
    readonly layout: Layout,
    readonly geometry: Geometry,
    readonly characterDict: CharacterDict,
    readonly geometryDict: GeometryDict,
  ) {
    const characters = new Map<KeyId, KeyCharacters>();
    const combos = new Map<CodePoint, KeyCombo>();
    const shapes = new Map<KeyId, KeyShape>();
    const zones = new Map<ZoneId, KeyShape[]>();

    for (const [id, [a = null, b = null, c = null, d = null]] of Object.entries(
      characterDict,
    )) {
      characters.set(id, new KeyCharacters(id, a, b, c, d));
    }

    for (const { id, a, b, c, d } of characters.values()) {
      if (KeyCharacters.isCodePoint(a)) {
        addCombo(combos, a, id, KeyModifier.None);
      }
      if (KeyCharacters.isCodePoint(b)) {
        addCombo(combos, b, id, KeyModifier.Shift);
      }
      if (KeyCharacters.isCodePoint(c)) {
        addCombo(combos, c, id, KeyModifier.Alt);
      }
      if (KeyCharacters.isCodePoint(d)) {
        addCombo(combos, d, id, KeyModifier.ShiftAlt);
      }
    }

    for (const { id, a, b, c, d } of characters.values()) {
      if (KeyCharacters.isDead(a)) {
        addDeadCombo(combos, a, id, KeyModifier.None);
      }
      if (KeyCharacters.isDead(b)) {
        addDeadCombo(combos, b, id, KeyModifier.Shift);
      }
      if (KeyCharacters.isDead(c)) {
        addDeadCombo(combos, c, id, KeyModifier.Alt);
      }
      if (KeyCharacters.isDead(d)) {
        addDeadCombo(combos, d, id, KeyModifier.ShiftAlt);
      }
    }

    for (const [id, data] of Object.entries(
      layout.mod(geometry, geometryDict),
    )) {
      const shape = new KeyShape(id, data, characterDict[id] ?? null);
      shapes.set(id, shape);
      for (const zone of shape.zones) {
        let list = zones.get(zone);
        if (list == null) {
          zones.set(zone, (list = []));
        }
        list.push(shape);
      }
    }

    this.layout = layout;
    this.geometry = geometry;
    this.characters = characters;
    this.combos = combos;
    this.shapes = shapes;
    this.zones = zones;
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

  getCodePoints({
    zones,
    dead = true,
    shift = true,
    alt = true,
  }: Partial<ZoneFilter> = {}): WeightedCodePointSet {
    const list: CodePoint[] = [];
    const weights = new Map<CodePoint, number>();
    for (const combo of this.combos.values()) {
      const shape = this.getShape(combo.id);
      if (
        (combo.prefix == null || dead) &&
        (!combo.shift || shift) &&
        (!combo.alt || alt) &&
        (zones == null || shape?.inAnyZone(zones))
      ) {
        list.push(combo.codePoint);
        switch (shape?.row) {
          case "home":
            weights.set(combo.codePoint, 1);
            break;
          case "top":
            weights.set(combo.codePoint, 2);
            break;
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

  getExampleText(): string {
    return getExampleText(this.layout.language);
  }

  getExampleLetters(): CodePoint[] {
    const codePoints = this.getCodePoints();
    return getExampleLetters(this.layout.language).filter(codePoints.has);
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
  character: CodePoint,
  id: KeyId,
  modifier: KeyModifier,
): void {
  setCombo(map, new KeyCombo(character, id, modifier));
}

function addDeadCombo(
  map: Map<CodePoint, KeyCombo>,
  { dead }: DeadCharacter,
  id: KeyId,
  modifier: KeyModifier,
): void {
  if (isDiacritic(dead)) {
    const prefix = new KeyCombo(dead, id, modifier);
    for (const combo of map.values()) {
      if (combo.prefix == null) {
        const combinedCodePoint = combineDiacritic(combo.codePoint, dead);
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
