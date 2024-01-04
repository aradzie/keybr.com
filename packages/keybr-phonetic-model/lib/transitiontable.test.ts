import test from "ava";
import { Letter } from "./letter.ts";
import { TransitionTable, TransitionTableBuilder } from "./transitiontable.ts";

test("builds table", (t) => {
  const builder = new TransitionTableBuilder(2, [0x0020, 0x0061, 0x0062]);

  builder.set([0x0020, 0x0061], 127);
  builder.set([0x0020, 0x0062], 128);
  builder.set([0x0062, 0x0062], 255);

  const table = builder.build();

  t.is(String.fromCodePoint(...table.alphabet), " ab");
  t.is(table.size, 3);
  t.is(table.order, 2);

  t.deepEqual(table.segment([0x0020]), [
    {
      codePoint: 0x0061,
      frequency: 127,
    },
    {
      codePoint: 0x0062,
      frequency: 128,
    },
  ]);
  t.deepEqual(table.segment([0x0061]), []);
  t.deepEqual(table.segment([0x0062]), [
    {
      codePoint: 0x0062,
      frequency: 255,
    },
  ]);
  t.deepEqual(table.letters(), [
    new Letter(0x0020, 0),
    new Letter(0x0061, 127),
    new Letter(0x0062, 383),
  ]);
});

test("validates binary data", (t) => {
  t.throws(() => {
    TransitionTable.load(new Uint8Array(0));
  });
  t.throws(() => {
    TransitionTable.load(new Uint8Array(100));
  });
  t.throws(() => {
    TransitionTable.load(new Uint8Array([1, 2, 3]));
  });
});

test("parses binary data", (t) => {
  // prettier-ignore
  const data = new Uint8Array([
    // signature
    0x6b, 0x65, 0x79, 0x62, 0x72, 0x2e, 0x63, 0x6f, 0x6d,
    // order
    0x02,
    // alphabet size
    0x03,
    // alphabet
    0x00, 0x20, 0x00, 0x61, 0x00, 0x62,
    // frequencies, stride 0
    0x02, 0x01, 0x7f, 0x02, 0x80,
    // frequencies, stride 1
    0x00,
    // frequencies, stride 2
    0x00,
  ]);

  const table = TransitionTable.load(data);

  t.deepEqual(table.compress(), data);

  t.is(String.fromCodePoint(...table.alphabet), " ab");
  t.is(table.size, 3);
  t.is(table.order, 2);

  t.deepEqual(table.segment([0]), [
    {
      codePoint: 0x0061,
      frequency: 127,
    },
    {
      codePoint: 0x0062,
      frequency: 128,
    },
  ]);
  t.deepEqual(table.segment([0x0061]), []);
  t.deepEqual(table.segment([0x0062]), []);
});
