import { Ngram1, Ngram2 } from "@keybr/keyboard";
import englishOrder1 from "./data/english.order1.json";
import englishOrder2 from "./data/english.order2.json";

const alphabet = englishOrder1.map(([a]) => a);

export const englishN1 = (() => {
  const ngram = new Ngram1(alphabet);
  for (const [a, f] of englishOrder1) {
    ngram.set(a, f);
  }
  return ngram;
})();

export const englishN2 = (() => {
  const ngram = new Ngram2(alphabet);
  for (const [a, b, f] of englishOrder2) {
    ngram.set(a, b, f);
  }
  return ngram;
})();
