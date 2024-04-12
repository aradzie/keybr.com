import { Language } from "@keybr/keyboard";
import test from "ava";
import { TransitionTableBuilder } from "./builder.ts";
import { Letter } from "./letter.ts";

test("build table", (t) => {
  const builder = new TransitionTableBuilder(2, [0x0020, 0x0061, 0x0062]);

  builder.set([0x0020, 0x0061], 127);
  builder.set([0x0020, 0x0062], 128);
  builder.set([0x0062, 0x0062], 255);

  const table = builder.build();

  t.is(String.fromCodePoint(...table.alphabet), " ab");
  t.is(table.size, 3);
  t.is(table.order, 2);

  t.deepEqual(table.segment([0x0020]), [
    { codePoint: 0x0061, frequency: 127 },
    { codePoint: 0x0062, frequency: 128 },
  ]);
  t.deepEqual(table.segment([0x0061]), []);
  t.deepEqual(table.segment([0x0062]), [{ codePoint: 0x0062, frequency: 255 }]);
  t.deepEqual(table.letters(Language.EN), [
    new Letter(0x0020, 0, " "),
    new Letter(0x0061, 127, "A"),
    new Letter(0x0062, 383, "B"),
  ]);
});

test("scale frequencies", (t) => {
  const builder = new TransitionTableBuilder(2, [0x0020, 0x0061, 0x0062]);

  t.deepEqual(builder.scaleFrequencies([]), []);
  t.deepEqual(builder.scaleFrequencies([{ codePoint: 0x0061, frequency: 1 }]), [
    { codePoint: 0x0061, frequency: 255 },
  ]);
  t.deepEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1 },
      { codePoint: 0x0062, frequency: 1 },
    ]),
    [
      { codePoint: 0x0061, frequency: 127 },
      { codePoint: 0x0062, frequency: 128 },
    ],
  );
  t.deepEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1000 },
      { codePoint: 0x0062, frequency: 1000 },
    ]),
    [
      { codePoint: 0x0061, frequency: 127 },
      { codePoint: 0x0062, frequency: 128 },
    ],
  );
  t.deepEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1 },
      { codePoint: 0x0062, frequency: 1000 },
    ]),
    [
      { codePoint: 0x0061, frequency: 1 },
      { codePoint: 0x0062, frequency: 254 },
    ],
  );
  t.deepEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1000 },
      { codePoint: 0x0062, frequency: 1 },
    ]),
    [
      { codePoint: 0x0061, frequency: 254 },
      { codePoint: 0x0062, frequency: 1 },
    ],
  );
});
