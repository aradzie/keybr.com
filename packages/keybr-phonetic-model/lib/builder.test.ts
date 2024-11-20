import { test } from "node:test";
import { Language } from "@keybr/keyboard";
import { deepEqual, equal } from "rich-assert";
import { TransitionTableBuilder } from "./builder.ts";
import { Letter } from "./letter.ts";

test("build table", () => {
  const builder = new TransitionTableBuilder(2, [0x0020, 0x0061, 0x0062]);

  builder.set([0x0020, 0x0061], 127);
  builder.set([0x0020, 0x0062], 128);
  builder.set([0x0062, 0x0062], 255);

  const table = builder.build();

  equal(String.fromCodePoint(...table.alphabet), " ab");
  equal(table.size, 3);
  equal(table.order, 2);

  deepEqual(table.segment([0x0020]), [
    { codePoint: 0x0061, frequency: 127 },
    { codePoint: 0x0062, frequency: 128 },
  ]);
  deepEqual(table.segment([0x0061]), []);
  deepEqual(table.segment([0x0062]), [{ codePoint: 0x0062, frequency: 255 }]);
  deepEqual(table.letters(Language.EN), [
    new Letter(0x0020, 0, " "),
    new Letter(0x0061, 127, "A"),
    new Letter(0x0062, 383, "B"),
  ]);
});

test("scale frequencies", () => {
  const builder = new TransitionTableBuilder(2, [0x0020, 0x0061, 0x0062]);

  deepEqual(builder.scaleFrequencies([]), []);
  deepEqual(builder.scaleFrequencies([{ codePoint: 0x0061, frequency: 1 }]), [
    { codePoint: 0x0061, frequency: 255 },
  ]);
  deepEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1 },
      { codePoint: 0x0062, frequency: 1 },
    ]),
    [
      { codePoint: 0x0061, frequency: 127 },
      { codePoint: 0x0062, frequency: 128 },
    ],
  );
  deepEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1000 },
      { codePoint: 0x0062, frequency: 1000 },
    ]),
    [
      { codePoint: 0x0061, frequency: 127 },
      { codePoint: 0x0062, frequency: 128 },
    ],
  );
  deepEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1 },
      { codePoint: 0x0062, frequency: 1000 },
    ]),
    [
      { codePoint: 0x0061, frequency: 1 },
      { codePoint: 0x0062, frequency: 254 },
    ],
  );
  deepEqual(
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
