import { test } from "node:test";
import { Language } from "@keybr/keyboard";
import { assert } from "chai";
import { TransitionTableBuilder } from "./builder.ts";
import { Letter } from "./letter.ts";

test("build table", () => {
  const builder = new TransitionTableBuilder(2, [0x0020, 0x0061, 0x0062]);

  builder.set([0x0020, 0x0061], 127);
  builder.set([0x0020, 0x0062], 128);
  builder.set([0x0062, 0x0062], 255);

  const table = builder.build();

  assert.strictEqual(String.fromCodePoint(...table.alphabet), " ab");
  assert.strictEqual(table.size, 3);
  assert.strictEqual(table.order, 2);

  assert.deepStrictEqual(table.segment([0x0020]), [
    { codePoint: 0x0061, frequency: 127 },
    { codePoint: 0x0062, frequency: 128 },
  ]);
  assert.deepStrictEqual(table.segment([0x0061]), []);
  assert.deepStrictEqual(table.segment([0x0062]), [
    { codePoint: 0x0062, frequency: 255 },
  ]);
  assert.deepStrictEqual(table.letters(Language.EN), [
    new Letter(0x0020, 0, " "),
    new Letter(0x0061, 127, "A"),
    new Letter(0x0062, 383, "B"),
  ]);
});

test("scale frequencies", () => {
  const builder = new TransitionTableBuilder(2, [0x0020, 0x0061, 0x0062]);

  assert.deepStrictEqual(builder.scaleFrequencies([]), []);
  assert.deepStrictEqual(
    builder.scaleFrequencies([{ codePoint: 0x0061, frequency: 1 }]),
    [{ codePoint: 0x0061, frequency: 255 }],
  );
  assert.deepStrictEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1 },
      { codePoint: 0x0062, frequency: 1 },
    ]),
    [
      { codePoint: 0x0061, frequency: 127 },
      { codePoint: 0x0062, frequency: 128 },
    ],
  );
  assert.deepStrictEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1000 },
      { codePoint: 0x0062, frequency: 1000 },
    ]),
    [
      { codePoint: 0x0061, frequency: 127 },
      { codePoint: 0x0062, frequency: 128 },
    ],
  );
  assert.deepStrictEqual(
    builder.scaleFrequencies([
      { codePoint: 0x0061, frequency: 1 },
      { codePoint: 0x0062, frequency: 1000 },
    ]),
    [
      { codePoint: 0x0061, frequency: 1 },
      { codePoint: 0x0062, frequency: 254 },
    ],
  );
  assert.deepStrictEqual(
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
