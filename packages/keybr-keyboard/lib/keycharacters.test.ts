import test from "ava";
import { KeyCharacters } from "./keycharacters.ts";
import { KeyModifier } from "./keymodifier.ts";

test("codepoint characters", (t) => {
  const characters = new KeyCharacters(
    "KeyA",
    /* a */ 0x0061,
    null,
    /* b */ 0x0062,
    null,
  );
  t.is(characters.getCodePoint(KeyModifier.None), /* a */ 0x0061);
  t.is(characters.getCodePoint(KeyModifier.Shift), /* a */ 0x0061);
  t.is(characters.getCodePoint(KeyModifier.Alt), /* b */ 0x0062);
  t.is(characters.getCodePoint(KeyModifier.ShiftAlt), /* b */ 0x0062);
});

test("dead characters", (t) => {
  const characters = new KeyCharacters(
    "KeyA",
    { dead: /* * */ 0x002a },
    { dead: /* * */ 0x002a },
    null,
    null,
  );
  t.is(characters.getCodePoint(KeyModifier.None), 0x0000);
  t.is(characters.getCodePoint(KeyModifier.Shift), 0x0000);
  t.is(characters.getCodePoint(KeyModifier.Alt), 0x0000);
  t.is(characters.getCodePoint(KeyModifier.ShiftAlt), 0x0000);
});

test("special characters", (t) => {
  const characters = new KeyCharacters(
    "KeyA",
    { special: /* a */ 0x0061 },
    { special: /* b */ 0x0062 },
    null,
    null,
  );
  t.is(characters.getCodePoint(KeyModifier.None), 0x0000);
  t.is(characters.getCodePoint(KeyModifier.Shift), 0x0000);
  t.is(characters.getCodePoint(KeyModifier.Alt), 0x0000);
  t.is(characters.getCodePoint(KeyModifier.ShiftAlt), 0x0000);
});

test("ligature characters", (t) => {
  const characters = new KeyCharacters(
    "KeyA",
    { ligature: "XX" },
    { ligature: "YY" },
    null,
    null,
  );
  t.is(characters.getCodePoint(KeyModifier.None), 0x0000);
  t.is(characters.getCodePoint(KeyModifier.Shift), 0x0000);
  t.is(characters.getCodePoint(KeyModifier.Alt), 0x0000);
  t.is(characters.getCodePoint(KeyModifier.ShiftAlt), 0x0000);
});
