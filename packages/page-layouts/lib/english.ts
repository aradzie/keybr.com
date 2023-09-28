import { Letter } from "@keybr/phonetic-model";
import dataEnglishOrder1 from "./data/english.order1.json";
import dataEnglishOrder2 from "./data/english.order2.json";
import { Bigram } from "./stats.ts";

export const letters = Object.freeze(
  dataEnglishOrder1.map(
    ([codePoint, frequency]) => new Letter(codePoint, frequency),
  ),
);

export const bigrams = Object.freeze(
  dataEnglishOrder2.map(
    ([codePoint0, codePoint1, frequency]) =>
      new Bigram(codePoint0, codePoint1, frequency),
  ),
);
