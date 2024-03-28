import dataEnglishOrder1 from "./data/english.order1.json";
import dataEnglishOrder2 from "./data/english.order2.json";

export const letters = Object.freeze(
  dataEnglishOrder1.map(([codePoint, f]) => ({ codePoint, f })),
);

export const bigrams = Object.freeze(
  dataEnglishOrder2.map(([codePoint0, codePoint1, f]) => ({
    codePoint0,
    codePoint1,
    f,
  })),
);
