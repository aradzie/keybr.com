import test from "ava";
import { KeyCharacters } from "./keycharacters.ts";
import { KeyModifier } from "./keymodifier.ts";

test("codepoints only", (t) => {
  const k = new KeyCharacters(
    "KeyA",
    /* a */ 0x0061,
    null,
    /* b */ 0x0062,
    null,
  );
  t.is(k.getCodePoint(KeyModifier.None), /* a */ 0x0061);
  t.is(k.getCodePoint(KeyModifier.Shift), /* a */ 0x0061);
  t.is(k.getCodePoint(KeyModifier.Alt), /* b */ 0x0062);
  t.is(k.getCodePoint(KeyModifier.ShiftAlt), /* b */ 0x0062);
});

test("non-codepoints only", (t) => {
  const k = new KeyCharacters(
    "KeyA",
    { special: /* a */ 0x0061 },
    { special: /* b */ 0x0062 },
    { ligature: "XX" },
    { ligature: "YY" },
  );
  t.is(k.getCodePoint(KeyModifier.None), 0x0000);
  t.is(k.getCodePoint(KeyModifier.Shift), 0x0000);
  t.is(k.getCodePoint(KeyModifier.Alt), 0x0000);
  t.is(k.getCodePoint(KeyModifier.ShiftAlt), 0x0000);
});
