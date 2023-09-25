import { Letter } from "@keybr/phonetic-model";
import dataEnglishOrder1 from "./data/english.order1.json";
import dataEnglishOrder2 from "./data/english.order2.json";
import { Transition } from "./stats.ts";

export const letters = Object.freeze(
  dataEnglishOrder1.map(
    ([codePoint, frequency]) => new Letter(codePoint, frequency),
  ),
);

export const transitions = Object.freeze(
  dataEnglishOrder2.map(
    ([fromCodePoint, toCodePoint, frequency]) =>
      new Transition(fromCodePoint, toCodePoint, frequency),
  ),
);
