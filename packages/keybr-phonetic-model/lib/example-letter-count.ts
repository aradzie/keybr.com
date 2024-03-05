#!/usr/bin/env -S node -r @keybr/tsl

import { Language } from "@keybr/keyboard";
import { toCodePoints } from "@keybr/unicode";
import { Filter } from "./filter.ts";
import { loadModelSync } from "./fs-load.ts";
import { Letter } from "./letter.ts";
import { type PhoneticModel } from "./phoneticmodel.ts";

example().catch((error) => console.error(error));

async function example(): Promise<void> {
  const { model } = loadModelSync(Language.EN);
  const { letters } = model;
  console.log(
    "unique letter count with no filter",
    average(model, Filter.empty),
  );
  for (const letter of Letter.frequencyOrder(letters)) {
    console.log(
      "unique letter count when focusing on " + letter,
      average(model, new Filter(null, letter)),
    );
  }
}

function average(model: PhoneticModel, filter: Filter): number {
  const count = 100;
  let sum = 0;
  for (let i = 0; i < count; i++) {
    sum += generate(model, filter);
  }
  return sum / count;
}

function generate(model: PhoneticModel, filter: Filter): number {
  const codePointSet = new Uint8Array(127);
  for (let i = 0; i < 50; i++) {
    const word = model.nextWord(filter);
    for (const codePoint of toCodePoints(word)) {
      codePointSet[codePoint] = 1;
    }
  }
  let size = 0;
  for (let i = 0; i < codePointSet.length; i++) {
    size += codePointSet[i];
  }
  return size;
}
