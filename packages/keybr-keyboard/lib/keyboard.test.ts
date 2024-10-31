import { test } from "node:test";
import { assert } from "chai";
import { Geometry } from "./geometry.ts";
import { Keyboard } from "./keyboard.ts";
import { KeyCharacters } from "./keycharacters.ts";
import { KeyCombo } from "./keycombo.ts";
import { KeyModifier } from "./keymodifier.ts";
import { Layout } from "./layout.ts";
import { type CharacterDict, type GeometryDict } from "./types.ts";

test("data", () => {
  const characterDict: CharacterDict = {
    KeyA: [
      /* "a" */ 0x0061, //
      /* "A" */ 0x0041,
      /* "b" */ 0x0062,
      /* "B" */ 0x0042,
    ],
    KeyB: [
      { special: /* "a" */ 0x0061 },
      { special: /* "b" */ 0x0062 },
      { ligature: "XX" },
      { ligature: "YY" },
    ],
    Equal: [
      { dead: /* COMBINING ACUTE ACCENT */ 0x0301 },
      { dead: /* COMBINING GRAVE ACCENT */ 0x0300 },
      { dead: /* "*" */ 0x002a },
      { dead: /* "*" */ 0x002a },
    ],
  };
  const geometryDict: GeometryDict = {
    KeyA: { x: 0, y: 0, zones: ["leftIndex", "left"] },
    KeyB: { x: 0, y: 0, zones: ["leftIndex", "left"] },
    Equal: { x: 0, y: 0, zones: ["rightIndex", "right"] },
  };
  const keyboard = new Keyboard(
    Layout.EN_US,
    Geometry.ANSI_101,
    characterDict,
    geometryDict,
  );
  const { None, Shift, Alt, ShiftAlt } = KeyModifier;
  const kc0x0300 = new KeyCombo(0x0300, "Equal", Shift);
  const kc0x0301 = new KeyCombo(0x0301, "Equal", None);
  const kc0x0041 = new KeyCombo(/* "A" */ 0x0041, "KeyA", Shift);
  const kc0x0061 = new KeyCombo(/* "a" */ 0x0061, "KeyA", None);
  const kc0x0042 = new KeyCombo(/* "B" */ 0x0042, "KeyA", ShiftAlt);
  const kc0x0062 = new KeyCombo(/* "b" */ 0x0062, "KeyA", Alt);
  const kc0x00c0 = new KeyCombo(/* "À" */ 0x00c0, "KeyA", Shift, kc0x0300);
  const kc0x00e0 = new KeyCombo(/* "à" */ 0x00e0, "KeyA", None, kc0x0300);
  const kc0x00c1 = new KeyCombo(/* "Á" */ 0x00c1, "KeyA", Shift, kc0x0301);
  const kc0x00e1 = new KeyCombo(/* "á" */ 0x00e1, "KeyA", None, kc0x0301);

  assert.deepStrictEqual(
    [...keyboard.getCodePoints({ dead: true, shift: true, alt: true })],
    [
      /* "A" */ 0x0041, /* "B" */ 0x0042, /* "a" */ 0x0061, /* "b" */ 0x0062,
      /* "À" */ 0x00c0, /* "Á" */ 0x00c1, /* "à" */ 0x00e0, /* "á" */ 0x00e1,
    ],
  );
  assert.deepStrictEqual(
    [...keyboard.getCodePoints({ dead: false, shift: true, alt: true })],
    [/* "A" */ 0x0041, /* "B" */ 0x0042, /* "a" */ 0x0061, /* "b" */ 0x0062],
  );
  assert.deepStrictEqual(
    [...keyboard.getCodePoints({ dead: false, shift: true, alt: false })],
    [/* "A" */ 0x0041, /* "a" */ 0x0061],
  );
  assert.deepStrictEqual(
    [...keyboard.getCodePoints({ dead: false, shift: false, alt: true })],
    [/* "a" */ 0x0061, /* "b" */ 0x0062],
  );
  assert.deepStrictEqual(
    [...keyboard.getCodePoints({ dead: false, shift: false, alt: false })],
    [/* "a" */ 0x0061],
  );
  assert.deepStrictEqual(
    [
      ...keyboard.getCodePoints({
        dead: false,
        shift: false,
        alt: false,
        zones: ["left"],
      }),
    ],
    [/* "a" */ 0x0061],
  );
  assert.deepStrictEqual(
    [
      ...keyboard.getCodePoints({
        dead: false,
        shift: false,
        alt: false,
        zones: ["right"],
      }),
    ],
    [],
  );

  assert.strictEqual(keyboard.getCharacters("Unknown"), null);
  assert.deepStrictEqual(
    keyboard.getCharacters("KeyA"),
    new KeyCharacters(
      "KeyA",
      /* "a" */ 0x0061,
      /* "A" */ 0x0041,
      /* "b" */ 0x0062,
      /* "B" */ 0x0042,
    ),
  );
  assert.deepStrictEqual(
    keyboard.getCharacters("KeyB"),
    new KeyCharacters(
      "KeyB",
      { special: /* "a" */ 0x0061 },
      { special: /* "b" */ 0x0062 },
      { ligature: "XX" },
      { ligature: "YY" },
    ),
  );
  assert.deepStrictEqual(
    keyboard.getCharacters("Equal"),
    new KeyCharacters(
      "Equal",
      { dead: /* COMBINING ACUTE ACCENT */ 0x0301 },
      { dead: /* COMBINING GRAVE ACCENT */ 0x0300 },
      { dead: /* "*" */ 0x002a },
      { dead: /* "*" */ 0x002a },
    ),
  );

  assert.deepStrictEqual(keyboard.getCombo(/* "A" */ 0x0041), kc0x0041);
  assert.deepStrictEqual(keyboard.getCombo(/* "a" */ 0x0061), kc0x0061);
  assert.deepStrictEqual(keyboard.getCombo(/* "B" */ 0x0042), kc0x0042);
  assert.deepStrictEqual(keyboard.getCombo(/* "b" */ 0x0062), kc0x0062);
  assert.deepStrictEqual(keyboard.getCombo(/* "À" */ 0x00c0), kc0x00c0);
  assert.deepStrictEqual(keyboard.getCombo(/* "à" */ 0x00e0), kc0x00e0);
  assert.deepStrictEqual(keyboard.getCombo(/* "Á" */ 0x00c1), kc0x00c1);
  assert.deepStrictEqual(keyboard.getCombo(/* "á" */ 0x00e1), kc0x00e1);

  const shapeKeyA = keyboard.getShape("KeyA")!;
  const shapeKeyB = keyboard.getShape("KeyB")!;
  const shapeEqual = keyboard.getShape("Equal")!;
  assert.strictEqual(shapeKeyA.finger, "leftIndex");
  assert.strictEqual(shapeKeyA.hand, "left");
  assert.strictEqual(shapeKeyA.row, null);
  assert.strictEqual(shapeEqual.finger, "rightIndex");
  assert.strictEqual(shapeEqual.hand, "right");
  assert.strictEqual(shapeEqual.row, null);
  assert.deepStrictEqual(keyboard.zones.get("left"), [shapeKeyA, shapeKeyB]);
  assert.deepStrictEqual(keyboard.zones.get("right"), [shapeEqual]);
  assert.deepStrictEqual(keyboard.zones.get("leftIndex"), [
    shapeKeyA,
    shapeKeyB,
  ]);
  assert.deepStrictEqual(keyboard.zones.get("rightIndex"), [shapeEqual]);
  assert.strictEqual(keyboard.zones.get("home"), undefined);
});
