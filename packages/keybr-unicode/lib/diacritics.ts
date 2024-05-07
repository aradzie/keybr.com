// https://en.wikipedia.org/wiki/Combining_character
// https://en.wikipedia.org/wiki/Diacritic
// https://en.wikipedia.org/wiki/List_of_precomposed_Latin_characters_in_Unicode
// https://bepo.fr/wiki/Touches_mortes

import { type CodePoint } from "./types.ts";

const toCombined = new Map<number, CodePoint>();
const toBase = new Map<CodePoint, CodePoint>();

export const isDiacritic = (codePoint: CodePoint): boolean =>
  codePoint >= 0x0300 && codePoint <= 0x036f;

export const combineDiacritic = (
  base: CodePoint,
  combining: CodePoint,
): CodePoint => {
  return toCombined.get((combining << 16) | base) ?? base;
};

export const stripDiacritic = (combined: CodePoint): CodePoint => {
  return toBase.get(combined) ?? combined;
};

for (const [codePoint, baseList, combinedList] of [
  [
    /* COMBINING GRAVE ACCENT */ 0x0300, //
    "AEINOUWYaeinouwy",
    "ÀÈÌǸÒÙẀỲàèìǹòùẁỳ",
  ],
  [
    /* COMBINING ACUTE ACCENT */ 0x0301, //
    "ACEGIKLMNOPRSUWYZacegiklmnoprsuwyzΑΕΗΙΟΥΩαεηιουω",
    "ÁĆÉǴÍḰĹḾŃÓṔŔŚÚẂÝŹáćéǵíḱĺḿńóṕŕśúẃýźΆΈΉΊΌΎΏάέήίόύώ",
  ],
  [
    /* COMBINING CIRCUMFLEX ACCENT */ 0x0302, //
    "ACEGHIJOSUWYZaceghijosuwyz",
    "ÂĈÊĜĤÎĴÔŜÛŴŶẐâĉêĝĥîĵôŝûŵŷẑ",
  ],
  [
    /* COMBINING TILDE */ 0x0303, //
    "AEINOUVYaeinouvy",
    "ÃẼĨÑÕŨṼỸãẽĩñõũṽỹ",
  ],
  [
    /* COMBINING MACRON */ 0x0304, //
    "AEGIOUYaegiouy",
    "ĀĒḠĪŌŪȲāēḡīōūȳ",
  ],
  [
    /* COMBINING BREVE */ 0x0306, //
    "AEGIOUaegiou",
    "ĂĔĞĬŎŬăĕğĭŏŭ",
  ],
  [
    /* COMBINING DOT ABOVE */ 0x0307,
    "ABCDEFGHIMNOPRSTWXYZabcdefghmnoprstwxyz",
    "ȦḂĊḊĖḞĠḢİṀṄȮṖṘṠṪẆẊẎŻȧḃċḋėḟġḣṁṅȯṗṙṡṫẇẋẏż",
  ],
  [
    /* COMBINING DIAERESIS */ 0x0308, //
    "AEHIOUWXYaehiotuwxyΙΥιυ",
    "ÄËḦÏÖÜẄẌŸäëḧïöẗüẅẍÿΪΫϊϋ",
  ],
  [
    /* COMBINING RING ABOVE */ 0x030a, //
    "AUauwy",
    "ÅŮåůẘẙ",
  ],
  [
    /* COMBINING DOUBLE ACUTE */ 0x030b, //
    "OUou",
    "ŐŰőű",
  ],
  [
    /* COMBINING CARON */ 0x030c, //
    "ACDEGHIKLNORSTUZacdeghijklnorstuz",
    "ǍČĎĚǦȞǏǨĽŇǑŘŠŤǓŽǎčďěǧȟǐǰǩľňǒřšťǔž",
  ],
  [
    /* COMBINING DOUBLE GRAVE ACCENT */ 0x030f, //
    "AEIORUaeioru",
    "ȀȄȈȌȐȔȁȅȉȍȑȕ",
  ],
  [
    /* COMBINING CEDILLA */ 0x0327, //
    "CDEGHKLNRSTcdeghklnrst",
    "ÇḐȨĢḨĶĻŅŖŞŢçḑȩģḩķļņŗşţ",
  ],
  [
    /* COMBINING OGONEK */ 0x0328, //
    "AEIOUaeiou",
    "ĄĘĮǪŲąęįǫų",
  ],
] as [CodePoint, string, string][]) {
  for (let i = 0; i < baseList.length; i++) {
    const base = baseList.codePointAt(i)!;
    const combined = combinedList.codePointAt(i)!;
    toCombined.set((codePoint << 16) | base, combined);
    toBase.set(combined, base);
  }
}
