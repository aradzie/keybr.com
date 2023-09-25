import test from "ava";
import { Filter } from "./filter.ts";
import { Letter } from "./letter.ts";
import { newPhoneticModel } from "./phoneticmodel.ts";
import { TransitionTableBuilder } from "./transitiontable.ts";

test("generates text from empty transition table", (t) => {
  const builder = new TransitionTableBuilder(4, [0x20, 0x61, 0x62, 0x63, 0x64]);

  const model = newPhoneticModel(builder.build());
  const { letters } = model;
  const [a, b, c, d] = letters;

  t.deepEqual(letters, [
    new Letter(0x61, 0.0),
    new Letter(0x62, 0.0),
    new Letter(0x63, 0.0),
    new Letter(0x64, 0.0),
  ]);

  t.is(model.nextWord(new Filter(null, null)), "");
  t.is(model.nextWord(new Filter([a], null)), "");
  t.is(model.nextWord(new Filter([a], a)), "a");
  t.is(model.nextWord(new Filter([a, b, c, d], a)), "a");
});

test("generates text from partial transition table", (t) => {
  const builder = new TransitionTableBuilder(4, [0x20, 0x61, 0x62, 0x63, 0x64]);
  builder.set([0x20, 0x20, 0x20, 0x61], 1);
  builder.set([0x20, 0x20, 0x20, 0x62], 1);
  builder.set([0x20, 0x20, 0x20, 0x63], 1);
  builder.set([0x20, 0x20, 0x20, 0x64], 1);

  const model = newPhoneticModel(builder.build());
  const { letters } = model;
  const [a, b, c, d] = letters;

  t.deepEqual(letters, [
    new Letter(0x61, 0.25),
    new Letter(0x62, 0.25),
    new Letter(0x63, 0.25),
    new Letter(0x64, 0.25),
  ]);

  t.regex(model.nextWord(new Filter(null, null)), /^[abcd]$/);
  t.regex(model.nextWord(new Filter([a], null)), /^[a]$/);
  t.regex(model.nextWord(new Filter([a], a)), /^[a]$/);
  t.regex(model.nextWord(new Filter([a, b, c, d], a)), /^[a]$/);
});

test("generates text from full transition table", (t) => {
  const builder = new TransitionTableBuilder(4, [0x20, 0x61, 0x62, 0x63, 0x64]);
  for (const a of [0x20, 0x61, 0x62, 0x63, 0x64]) {
    for (const b of [0x20, 0x61, 0x62, 0x63, 0x64]) {
      for (const c of [0x20, 0x61, 0x62, 0x63, 0x64]) {
        for (const d of [0x20, 0x61, 0x62, 0x63, 0x64]) {
          builder.set([a, b, c, d], 1);
        }
      }
    }
  }

  const model = newPhoneticModel(builder.build());
  const { letters } = model;
  const [a, b, c, d] = letters;

  t.deepEqual(letters, [
    new Letter(0x61, 0.25),
    new Letter(0x62, 0.25),
    new Letter(0x63, 0.25),
    new Letter(0x64, 0.25),
  ]);

  t.regex(model.nextWord(new Filter(null, null)), /^[abcd]{3,}$/);
  t.regex(model.nextWord(new Filter([a], null)), /^[a]{3,}$/);
  t.regex(model.nextWord(new Filter([a], a)), /^[a]{3,}$/);
  t.regex(model.nextWord(new Filter([a, b, c, d], a)), /^[abcd]{3,}$/);
});
