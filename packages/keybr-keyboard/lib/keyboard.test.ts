import { Layout } from "@keybr/layout";
import test from "ava";
import { isDiacritic } from "./diacritics.ts";
import { Keyboard } from "./keyboard.ts";
import { KeyboardKey } from "./keyboardkey.ts";
import { KeyCombo } from "./keycombo.ts";
import { KeyModifier } from "./keymodifier.ts";
import { makeKeys } from "./keys.ts";
import { loadKeyboard } from "./load.ts";
import { type CodePointDict, type GeometryDict } from "./types.ts";

test("keys", (t) => {
  const codePointDict: CodePointDict = {
    KeyA: [/* a */ 0x0061, /* A */ 0x0041, /* b */ 0x0062, /* B */ 0x0042],
    Equal: [0x0301, 0x0300],
  };
  const geometryDict: GeometryDict = {
    KeyA: [72, 84, 40, 40, "key", "pinky"],
    Equal: [504, 0, 40, 40, "key", "pinky"],
    Enter: [534, 84, 95, 40, "key-enter", "pinky"],
  };

  const keyboard = new Keyboard(
    Layout.getDefault(),
    makeKeys(codePointDict, geometryDict, /* full= */ true),
  );
  const key1 = new KeyboardKey(
    "KeyA",
    {
      a: /* a */ 0x0061,
      b: /* A */ 0x0041,
      c: /* b */ 0x0062,
      d: /* B */ 0x0042,
    },
    { x: 72, y: 84, w: 40, h: 40, shape: "key", finger: "pinky" },
  );
  const deadKey1 = new KeyboardKey(
    "Equal",
    { a: 0x0301, b: 0x0300, c: 0x0000, d: 0x0000 },
    { x: 504, y: 0, w: 40, h: 40, shape: "key", finger: "pinky" },
  );
  const specialKey1 = new KeyboardKey(
    "Enter",
    { a: 0x0000, b: 0x0000, c: 0x0000, d: 0x0000 },
    { x: 534, y: 84, w: 95, h: 40, shape: "key-enter", finger: "pinky" },
  );

  const { None, Shift, Alt, ShiftAlt } = KeyModifier;
  const kc0x0300 = new KeyCombo(0x0300, deadKey1, Shift);
  const kc0x0301 = new KeyCombo(0x0301, deadKey1, None);
  const kc0x0041 = new KeyCombo(/* A */ 0x0041, key1, Shift);
  const kc0x0061 = new KeyCombo(/* a */ 0x0061, key1, None);
  const kc0x0042 = new KeyCombo(/* B */ 0x0042, key1, ShiftAlt);
  const kc0x0062 = new KeyCombo(/* b */ 0x0062, key1, Alt);
  const kc0x00c0 = new KeyCombo(/* À */ 0x00c0, key1, Shift, kc0x0300);
  const kc0x00e0 = new KeyCombo(/* à */ 0x00e0, key1, None, kc0x0300);
  const kc0x00c1 = new KeyCombo(/* Á */ 0x00c1, key1, Shift, kc0x0301);
  const kc0x00e1 = new KeyCombo(/* á */ 0x00e1, key1, None, kc0x0301);

  t.deepEqual(
    keyboard.codePoints({
      enableDeadKeys: true,
      enableShift: true,
      enableAlt: true,
    }),
    new Set([
      /* A */ 0x0041, /* B */ 0x0042, /* a */ 0x0061, /* b */ 0x0062,
      /* À */ 0x00c0, /* Á */ 0x00c1, /* à */ 0x00e0, /* á */ 0x00e1,
    ]),
  );
  t.deepEqual(
    keyboard.codePoints({
      enableDeadKeys: false,
      enableShift: true,
      enableAlt: true,
    }),
    new Set([/* A */ 0x0041, /* B */ 0x0042, /* a */ 0x0061, /* b */ 0x0062]),
  );
  t.deepEqual(
    keyboard.codePoints({
      enableDeadKeys: false,
      enableShift: true,
      enableAlt: false,
    }),
    new Set([/* A */ 0x0041, /* a */ 0x0061]),
  );
  t.deepEqual(
    keyboard.codePoints({
      enableDeadKeys: false,
      enableShift: false,
      enableAlt: true,
    }),
    new Set([/* a */ 0x0061, /* b */ 0x0062]),
  );
  t.deepEqual(
    keyboard.codePoints({
      enableDeadKeys: false,
      enableShift: false,
      enableAlt: false,
    }),
    new Set([/* a */ 0x0061]),
  );

  t.deepEqual(keyboard.keys, [key1, deadKey1]);
  t.deepEqual(keyboard.specialKeys, [specialKey1]);
  t.is(keyboard.getKey("unknown"), null);
  t.deepEqual(keyboard.getKey("KeyA"), key1);
  t.deepEqual(keyboard.getKey("Equal"), deadKey1);

  t.deepEqual(keyboard.getKeyCombo(/* A */ 0x0041), kc0x0041);
  t.deepEqual(keyboard.getKeyCombo(/* a */ 0x0061), kc0x0061);
  t.deepEqual(keyboard.getKeyCombo(/* B */ 0x0042), kc0x0042);
  t.deepEqual(keyboard.getKeyCombo(/* b */ 0x0062), kc0x0062);
  t.deepEqual(keyboard.getKeyCombo(/* À */ 0x00c0), kc0x00c0);
  t.deepEqual(keyboard.getKeyCombo(/* à */ 0x00e0), kc0x00e0);
  t.deepEqual(keyboard.getKeyCombo(/* Á */ 0x00c1), kc0x00c1);
  t.deepEqual(keyboard.getKeyCombo(/* á */ 0x00e1), kc0x00e1);
});

for (const layout of Layout.ALL) {
  test(`layout ${layout.id}`, (t) => {
    const keyboard = loadKeyboard(layout, { full: true });
    const { keys } = keyboard;
    const codePoints = keyboard.codePoints({
      enableDeadKeys: true,
      enableShift: true,
      enableAlt: true,
    });

    t.true(keys.length > 0);
    t.true(codePoints.size > 0);

    for (const key of keys) {
      const {
        id,
        codePoints: { a, b, c, d },
      } = key;

      t.is(keyboard.getKey(id), key);

      if (a > 0 && !isDiacritic(a)) {
        t.true(codePoints.has(a));
        const keyCombo = keyboard.getKeyCombo(a);
        t.like(keyCombo, { codePoint: a });
      }
      if (b > 0 && !isDiacritic(b)) {
        t.true(codePoints.has(b));
        const keyCombo = keyboard.getKeyCombo(b);
        t.like(keyCombo, { codePoint: b });
      }
      if (c > 0 && !isDiacritic(c)) {
        t.true(codePoints.has(c));
        const keyCombo = keyboard.getKeyCombo(c);
        t.like(keyCombo, { codePoint: c });
      }
      if (d > 0 && !isDiacritic(d)) {
        t.true(codePoints.has(d));
        const keyCombo = keyboard.getKeyCombo(d);
        t.like(keyCombo, { codePoint: d });
      }
    }
  });
}
