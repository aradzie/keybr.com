// https://en.wikipedia.org/wiki/Combining_character
// https://en.wikipedia.org/wiki/Diacritic
// https://en.wikipedia.org/wiki/List_of_precomposed_Latin_characters_in_Unicode
// https://bepo.fr/wiki/Touches_mortes

import { type CodePoint } from "@keybr/unicode";

type Spec = readonly [
  name: string,
  codePoint: CodePoint,
  baseSet: string,
  precomposedSet: string,
];

// prettier-ignore
const spec: readonly Spec[] = [
  ["GRAVE ACCENT", 0x0300, "AEINOUWYaeinouwy", "ÀÈÌǸÒÙẀỲàèìǹòùẁỳ"],
  ["ACUTE ACCENT", 0x0301, "ACEGIKLMNOPRSUWYZacegiklmnoprsuwyz", "ÁĆÉǴÍḰĹḾŃÓṔŔŚÚẂÝŹáćéǵíḱĺḿńóṕŕśúẃýź"],
  ["CIRCUMFLEX ACCENT", 0x0302, "ACEGHIJOSUWYZaceghijosuwyz", "ÂĈÊĜĤÎĴÔŜÛŴŶẐâĉêĝĥîĵôŝûŵŷẑ"],
  ["TILDE", 0x0303, "AEINOUVYaeinouvy", "ÃẼĨÑÕŨṼỸãẽĩñõũṽỹ"],
  ["MACRON", 0x0304, "AEGIOUYaegiouy", "ĀĒḠĪŌŪȲāēḡīōūȳ"],
  ["BREVE", 0x0306, "AEGIOUaegiou", "ĂĔĞĬŎŬăĕğĭŏŭ"],
  ["DOT ABOVE", 0x0307, "ABCDEFGHIMNOPRSTWXYZabcdefghmnoprstwxyz", "ȦḂĊḊĖḞĠḢİṀṄȮṖṘṠṪẆẊẎŻȧḃċḋėḟġḣṁṅȯṗṙṡṫẇẋẏż"],
  ["DIAERESIS", 0x0308, "AEHIOUWXYaehiotuwxy", "ÄËḦÏÖÜẄẌŸäëḧïöẗüẅẍÿ"],
  ["RING ABOVE", 0x030a, "AUauwy", "ÅŮåůẘẙ"],
  ["DOUBLE ACUTE", 0x030b, "OUou", "ŐŰőű"],
  ["CARON", 0x030c, "ACDEGHIKLNORSTUZacdeghijklnorstuz", "ǍČĎĚǦȞǏǨĽŇǑŘŠŤǓŽǎčďěǧȟǐǰǩľňǒřšťǔž"],
  ["DOUBLE GRAVE ACCENT", 0x030f, "AEIORUaeioru", "ȀȄȈȌȐȔȁȅȉȍȑȕ"],
  ["CEDILLA", 0x0327, "CDEGHKLNRSTcdeghklnrst", "ÇḐȨĢḨĶĻŅŖŞŢçḑȩģḩķļņŗşţ"],
  ["OGONEK", 0x0328, "AEIOUaeiou", "ĄĘĮǪŲąęįǫų"],
];

export type Diacritic = {
  readonly name: string;
  readonly codePoint: CodePoint;
  readonly baseSet: string;
  readonly precomposedSet: string;
};

const diacriticMap = new Map<CodePoint, Diacritic>();
const combinedMap = new Map<CodePoint, CodePoint>();

export const isDiacritic = (codePoint: CodePoint): boolean =>
  diacriticMap.has(codePoint);

export const getDiacritic = (codePoint: CodePoint): Diacritic | null =>
  diacriticMap.get(codePoint) ?? null;

export const combineDiacritic = (
  base: CodePoint,
  combining: CodePoint,
): CodePoint => combinedMap.get((combining << 16) | base) ?? base;

for (const [name, codePoint, baseSet, precomposedSet] of spec) {
  diacriticMap.set(codePoint, { name, codePoint, baseSet, precomposedSet });
  for (let i = 0; i < baseSet.length; i++) {
    const base = baseSet.charCodeAt(i);
    const precomposed = precomposedSet.charCodeAt(i);
    combinedMap.set((codePoint << 16) | base, precomposed);
  }
}
