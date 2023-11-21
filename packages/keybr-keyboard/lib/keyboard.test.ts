import { Layout } from "@keybr/layout";
import test from "ava";
import { isDiacritic } from "./diacritics.ts";
import { Keyboard } from "./keyboard.ts";
import { KeyCharacters } from "./keycharacters.ts";
import { KeyCombo } from "./keycombo.ts";
import { KeyModifier } from "./keymodifier.ts";
import { loadKeyboard } from "./load.ts";
import { type CodePointDict, type GeometryDict } from "./types.ts";

test("keys", (t) => {
  const codePointDict: CodePointDict = {
    KeyA: [/* a */ 0x0061, /* A */ 0x0041, /* b */ 0x0062, /* B */ 0x0042],
    Equal: [0x0301, 0x0300],
  };
  const geometryDict: GeometryDict = {};
  const keyboard = new Keyboard(Layout.EN_US, codePointDict, geometryDict);
  const key1 = new KeyCharacters(
    "KeyA",
    /* a */ 0x0061,
    /* A */ 0x0041,
    /* b */ 0x0062,
    /* B */ 0x0042,
  );
  const deadKey1 = new KeyCharacters("Equal", 0x0301, 0x0300, 0x0000, 0x0000);

  const { None, Shift, Alt, ShiftAlt } = KeyModifier;
  const kc0x0300 = new KeyCombo(0x0300, "Equal", Shift);
  const kc0x0301 = new KeyCombo(0x0301, "Equal", None);
  const kc0x0041 = new KeyCombo(/* A */ 0x0041, "KeyA", Shift);
  const kc0x0061 = new KeyCombo(/* a */ 0x0061, "KeyA", None);
  const kc0x0042 = new KeyCombo(/* B */ 0x0042, "KeyA", ShiftAlt);
  const kc0x0062 = new KeyCombo(/* b */ 0x0062, "KeyA", Alt);
  const kc0x00c0 = new KeyCombo(/* À */ 0x00c0, "KeyA", Shift, kc0x0300);
  const kc0x00e0 = new KeyCombo(/* à */ 0x00e0, "KeyA", None, kc0x0300);
  const kc0x00c1 = new KeyCombo(/* Á */ 0x00c1, "KeyA", Shift, kc0x0301);
  const kc0x00e1 = new KeyCombo(/* á */ 0x00e1, "KeyA", None, kc0x0301);

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

  t.is(keyboard.getCharacters("unknown"), null);
  t.deepEqual(keyboard.getCharacters("KeyA"), key1);
  t.deepEqual(keyboard.getCharacters("Equal"), deadKey1);

  t.deepEqual(keyboard.getCombo(/* A */ 0x0041), kc0x0041);
  t.deepEqual(keyboard.getCombo(/* a */ 0x0061), kc0x0061);
  t.deepEqual(keyboard.getCombo(/* B */ 0x0042), kc0x0042);
  t.deepEqual(keyboard.getCombo(/* b */ 0x0062), kc0x0062);
  t.deepEqual(keyboard.getCombo(/* À */ 0x00c0), kc0x00c0);
  t.deepEqual(keyboard.getCombo(/* à */ 0x00e0), kc0x00e0);
  t.deepEqual(keyboard.getCombo(/* Á */ 0x00c1), kc0x00c1);
  t.deepEqual(keyboard.getCombo(/* á */ 0x00e1), kc0x00e1);
});

for (const layout of Layout.ALL) {
  test(`layout ${layout.id}`, (t) => {
    const keyboard = loadKeyboard(layout);
    const { characters } = keyboard;
    const codePoints = keyboard.codePoints({
      enableDeadKeys: true,
      enableShift: true,
      enableAlt: true,
    });

    t.true(characters.size > 0);
    t.true(codePoints.size > 0);

    for (const key of characters.values()) {
      const { id, a, b, c, d } = key;

      t.is(keyboard.getCharacters(id), key);

      if (a > 0 && !isDiacritic(a)) {
        t.true(codePoints.has(a));
        const combo = keyboard.getCombo(a);
        t.like(combo, { codePoint: a });
      }
      if (b > 0 && !isDiacritic(b)) {
        t.true(codePoints.has(b));
        const combo = keyboard.getCombo(b);
        t.like(combo, { codePoint: b });
      }
      if (c > 0 && !isDiacritic(c)) {
        t.true(codePoints.has(c));
        const combo = keyboard.getCombo(c);
        t.like(combo, { codePoint: c });
      }
      if (d > 0 && !isDiacritic(d)) {
        t.true(codePoints.has(d));
        const combo = keyboard.getCombo(d);
        t.like(combo, { codePoint: d });
      }
    }
  });
}
