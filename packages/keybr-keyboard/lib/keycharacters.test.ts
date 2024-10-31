import { test } from "node:test";
import { assert } from "chai";
import { KeyCharacters } from "./keycharacters.ts";
import { KeyModifier } from "./keymodifier.ts";

test("codepoint characters", () => {
  const characters = new KeyCharacters(
    "KeyA",
    /* "a" */ 0x0061,
    null,
    /* "b" */ 0x0062,
    null,
  );
  assert.strictEqual(
    characters.getCodePoint(KeyModifier.None),
    /* "a" */ 0x0061,
  );
  assert.strictEqual(
    characters.getCodePoint(KeyModifier.Shift),
    /* "a" */ 0x0061,
  );
  assert.strictEqual(
    characters.getCodePoint(KeyModifier.Alt),
    /* "b" */ 0x0062,
  );
  assert.strictEqual(
    characters.getCodePoint(KeyModifier.ShiftAlt),
    /* "b" */ 0x0062,
  );
});

test("dead characters", () => {
  const characters = new KeyCharacters(
    "KeyA",
    { dead: /* "*" */ 0x002a },
    { dead: /* "*" */ 0x002a },
    null,
    null,
  );
  assert.strictEqual(characters.getCodePoint(KeyModifier.None), 0x0000);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Shift), 0x0000);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Alt), 0x0000);
  assert.strictEqual(characters.getCodePoint(KeyModifier.ShiftAlt), 0x0000);
});

test("special characters", () => {
  const characters = new KeyCharacters(
    "KeyA",
    { special: /* "a" */ 0x0061 },
    { special: /* "b" */ 0x0062 },
    null,
    null,
  );
  assert.strictEqual(characters.getCodePoint(KeyModifier.None), 0x0000);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Shift), 0x0000);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Alt), 0x0000);
  assert.strictEqual(characters.getCodePoint(KeyModifier.ShiftAlt), 0x0000);
});

test("ligature characters", () => {
  const characters = new KeyCharacters(
    "KeyA",
    { ligature: "XX" },
    { ligature: "YY" },
    null,
    null,
  );
  assert.strictEqual(characters.getCodePoint(KeyModifier.None), 0x0000);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Shift), 0x0000);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Alt), 0x0000);
  assert.strictEqual(characters.getCodePoint(KeyModifier.ShiftAlt), 0x0000);
});
