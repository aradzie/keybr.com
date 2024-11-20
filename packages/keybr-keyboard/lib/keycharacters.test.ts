import { test } from "node:test";
import { equal } from "rich-assert";
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
  equal(characters.getCodePoint(KeyModifier.None), 0x0061);
  equal(characters.getCodePoint(KeyModifier.Shift), 0x0061);
  equal(characters.getCodePoint(KeyModifier.Alt), 0x0062);
  equal(characters.getCodePoint(KeyModifier.ShiftAlt), 0x0062);
});

test("dead, special and ligature characters", () => {
  const characters = new KeyCharacters(
    "KeyA",
    /* "a" */ 0x0061,
    { dead: /* COMBINING GRAVE ACCENT */ 0x0300 },
    { special: /* ZERO WIDTH NON-JOINER */ 0x200c },
    { ligature: "XYZ" },
  );
  equal(characters.getCodePoint(KeyModifier.None), 0x0061);
  equal(characters.getCodePoint(KeyModifier.Shift), null);
  equal(characters.getCodePoint(KeyModifier.Alt), null);
  equal(characters.getCodePoint(KeyModifier.ShiftAlt), null);
});
