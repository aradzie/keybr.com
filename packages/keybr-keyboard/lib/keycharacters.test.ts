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
  assert.strictEqual(characters.getCodePoint(KeyModifier.None), 0x0061);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Shift), 0x0061);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Alt), 0x0062);
  assert.strictEqual(characters.getCodePoint(KeyModifier.ShiftAlt), 0x0062);
});

test("dead, special and ligature characters", () => {
  const characters = new KeyCharacters(
    "KeyA",
    /* "a" */ 0x0061,
    { dead: /* COMBINING GRAVE ACCENT */ 0x0300 },
    { special: /* ZERO WIDTH NON-JOINER */ 0x200c },
    { ligature: "XYZ" },
  );
  assert.strictEqual(characters.getCodePoint(KeyModifier.None), 0x0061);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Shift), null);
  assert.strictEqual(characters.getCodePoint(KeyModifier.Alt), null);
  assert.strictEqual(characters.getCodePoint(KeyModifier.ShiftAlt), null);
});
