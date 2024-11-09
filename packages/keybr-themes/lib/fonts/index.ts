import { type CSSProperties } from "react";

export type FontWeight = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
export type FontStyle = "normal" | "italic";
export type Fallback = "cursive" | "fantasy" | "monospace" | "sans-serif" | "serif" | "whitespace" | string;
export type Script = "arabic" | "cyrillic" | "greek" | "hebrew" | "latin" | "thai";

export class FontFace {
  readonly family: string;
  readonly weight: FontWeight;
  readonly style: FontStyle;
  readonly fallbacks: readonly Fallback[];
  readonly scripts: readonly Script[];
  readonly name: string;
  readonly cssProperties: CSSProperties;

  constructor(
    family: string,
    weight: FontWeight,
    style: FontStyle,
    fallbacks: readonly Fallback[],
    scripts: readonly Script[],
  ) {
    this.family = family;
    this.weight = weight;
    this.style = style;
    this.fallbacks = fallbacks;
    this.scripts = scripts;
    this.name = fontName(family, weight, style);
    this.cssProperties = {
      fontFamily: [family, ...fallbacks].join(","),
      fontWeight: weight,
      fontStyle: style,
    };
  }
}

const cl = ["cyrillic", "latin"] as const satisfies Script[];
const cgl = ["cyrillic", "greek", "latin"] as const satisfies Script[];
const cghl = ["cyrillic", "greek", "hebrew", "latin"] as const satisfies Script[];
const achl = ["arabic", "cyrillic", "hebrew", "latin"] as const satisfies Script[];
const acghlt = ["arabic", "cyrillic", "greek", "hebrew", "latin", "thai"] as const satisfies Script[];

export const ARAD = new FontFace("Arad", "400", "normal", ["whitespace"], ["arabic"]);
export const ARAD_B = new FontFace("Arad", "700", "normal", ["whitespace"], ["arabic"]);
export const CORMORANT = new FontFace("Cormorant", "400", "normal", ["serif"], cl);
export const CORMORANT_I = new FontFace("Cormorant", "400", "italic", ["serif"], cl);
export const CORMORANT_B = new FontFace("Cormorant", "700", "normal", ["serif"], cl);
export const CORMORANT_BI = new FontFace("Cormorant", "700", "italic", ["serif"], cl);
export const NEWSREADER = new FontFace("Newsreader", "400", "normal", ["serif"], ["latin"]);
export const NEWSREADER_I = new FontFace("Newsreader", "400", "italic", ["serif"], ["latin"]);
export const NEWSREADER_B = new FontFace("Newsreader", "700", "normal", ["serif"], ["latin"]);
export const NEWSREADER_BI = new FontFace("Newsreader", "700", "italic", ["serif"], ["latin"]);
export const NUNITO = new FontFace("Nunito", "400", "normal", ["sans-serif"], cl);
export const NUNITO_I = new FontFace("Nunito", "400", "italic", ["sans-serif"], cl);
export const NUNITO_B = new FontFace("Nunito", "700", "normal", ["sans-serif"], cl);
export const NUNITO_BI = new FontFace("Nunito", "700", "italic", ["sans-serif"], cl);
export const OPEN_DYSLEXIC = new FontFace("Open Dyslexic", "400", "normal", ["sans-serif"], cgl);
export const OPEN_DYSLEXIC_I = new FontFace("Open Dyslexic", "400", "italic", ["sans-serif"], cgl);
export const OPEN_DYSLEXIC_B = new FontFace("Open Dyslexic", "700", "normal", ["sans-serif"], cgl);
export const OPEN_DYSLEXIC_BI = new FontFace("Open Dyslexic", "700", "italic", ["sans-serif"], cgl);
export const OPEN_SANS = new FontFace("Open Sans", "400", "normal", ["sans-serif"], cghl);
export const OPEN_SANS_I = new FontFace("Open Sans", "400", "italic", ["sans-serif"], cghl);
export const OPEN_SANS_B = new FontFace("Open Sans", "700", "normal", ["sans-serif"], cghl);
export const OPEN_SANS_BI = new FontFace("Open Sans", "700", "italic", ["sans-serif"], cghl);
export const ROBOTO = new FontFace("Roboto", "400", "normal", ["sans-serif"], cgl);
export const ROBOTO_I = new FontFace("Roboto", "400", "italic", ["sans-serif"], cgl);
export const ROBOTO_B = new FontFace("Roboto", "700", "normal", ["sans-serif"], cgl);
export const ROBOTO_BI = new FontFace("Roboto", "700", "italic", ["sans-serif"], cgl);
export const ROBOTO_MONO = new FontFace("Roboto Mono", "400", "normal", ["monospace"], cgl);
export const ROBOTO_MONO_I = new FontFace("Roboto Mono", "400", "italic", ["monospace"], cgl);
export const ROBOTO_MONO_B = new FontFace("Roboto Mono", "700", "normal", ["monospace"], cgl);
export const ROBOTO_MONO_BI = new FontFace("Roboto Mono", "700", "italic", ["monospace"], cgl);
export const RUBIK = new FontFace("Rubik", "400", "normal", ["sans-serif"], achl);
export const RUBIK_I = new FontFace("Rubik", "400", "italic", ["sans-serif"], achl);
export const RUBIK_B = new FontFace("Rubik", "700", "normal", ["sans-serif"], achl);
export const RUBIK_BI = new FontFace("Rubik", "700", "italic", ["sans-serif"], achl);
export const SHANTELL_SANS = new FontFace("Shantell Sans", "400", "normal", ["serif"], cl);
export const SHANTELL_SANS_I = new FontFace("Shantell Sans", "400", "italic", ["serif"], cl);
export const SHANTELL_SANS_B = new FontFace("Shantell Sans", "700", "normal", ["serif"], cl);
export const SHANTELL_SANS_BI = new FontFace("Shantell Sans", "700", "italic", ["serif"], cl);
export const SPECTRAL = new FontFace("Spectral", "400", "normal", ["serif"], cl);
export const SPECTRAL_I = new FontFace("Spectral", "400", "italic", ["serif"], cl);
export const SPECTRAL_B = new FontFace("Spectral", "700", "normal", ["serif"], cl);
export const SPECTRAL_BI = new FontFace("Spectral", "700", "italic", ["serif"], cl);
export const UBUNTU = new FontFace("Ubuntu", "400", "normal", ["sans-serif"], cgl);
export const UBUNTU_I = new FontFace("Ubuntu", "400", "italic", ["sans-serif"], cgl);
export const UBUNTU_B = new FontFace("Ubuntu", "700", "normal", ["sans-serif"], cgl);
export const UBUNTU_BI = new FontFace("Ubuntu", "700", "italic", ["sans-serif"], cgl);
export const UBUNTU_MONO = new FontFace("Ubuntu Mono", "400", "normal", ["monospace"], cgl);
export const UBUNTU_MONO_I = new FontFace("Ubuntu Mono", "400", "italic", ["monospace"], cgl);
export const UBUNTU_MONO_B = new FontFace("Ubuntu Mono", "700", "normal", ["monospace"], cgl);
export const UBUNTU_MONO_BI = new FontFace("Ubuntu Mono", "700", "italic", ["monospace"], cgl);
export const SERIF = new FontFace("serif", "400", "normal", ["whitespace"], acghlt);
export const SERIF_I = new FontFace("serif", "400", "italic", ["whitespace"], acghlt);
export const SERIF_B = new FontFace("serif", "700", "normal", ["whitespace"], acghlt);
export const SERIF_BI = new FontFace("serif", "700", "italic", ["whitespace"], acghlt);
export const SANS_SERIF = new FontFace("sans-serif", "400", "normal", ["whitespace"], acghlt);
export const SANS_SERIF_I = new FontFace("sans-serif", "400", "italic", ["whitespace"], acghlt);
export const SANS_SERIF_B = new FontFace("sans-serif", "700", "normal", ["whitespace"], acghlt);
export const SANS_SERIF_BI = new FontFace("sans-serif", "700", "italic", ["whitespace"], acghlt);
export const MONOSPACE = new FontFace("monospace", "400", "normal", ["whitespace"], acghlt);
export const MONOSPACE_I = new FontFace("monospace", "400", "italic", ["whitespace"], acghlt);
export const MONOSPACE_B = new FontFace("monospace", "700", "normal", ["whitespace"], acghlt);
export const MONOSPACE_BI = new FontFace("monospace", "700", "italic", ["whitespace"], acghlt);
export const CURSIVE = new FontFace("cursive", "400", "normal", ["whitespace"], acghlt);
export const CURSIVE_I = new FontFace("cursive", "400", "italic", ["whitespace"], acghlt);
export const CURSIVE_B = new FontFace("cursive", "700", "normal", ["whitespace"], acghlt);
export const CURSIVE_BI = new FontFace("cursive", "700", "italic", ["whitespace"], acghlt);

export const FONTS_FACES: readonly FontFace[] = [
  ARAD,
  ARAD_B,
  CORMORANT,
  CORMORANT_I,
  CORMORANT_B,
  CORMORANT_BI,
  NEWSREADER,
  NEWSREADER_I,
  NEWSREADER_B,
  NEWSREADER_BI,
  NUNITO,
  NUNITO_I,
  NUNITO_B,
  NUNITO_BI,
  OPEN_SANS,
  OPEN_SANS_I,
  OPEN_SANS_B,
  OPEN_SANS_BI,
  ROBOTO,
  ROBOTO_I,
  ROBOTO_B,
  ROBOTO_BI,
  ROBOTO_MONO,
  ROBOTO_MONO_I,
  ROBOTO_MONO_B,
  ROBOTO_MONO_BI,
  RUBIK,
  RUBIK_I,
  RUBIK_B,
  RUBIK_BI,
  SHANTELL_SANS,
  SHANTELL_SANS_I,
  SHANTELL_SANS_B,
  SHANTELL_SANS_BI,
  SPECTRAL,
  SPECTRAL_I,
  SPECTRAL_B,
  SPECTRAL_BI,
  UBUNTU,
  UBUNTU_I,
  UBUNTU_B,
  UBUNTU_BI,
  UBUNTU_MONO,
  UBUNTU_MONO_I,
  UBUNTU_MONO_B,
  UBUNTU_MONO_BI,
  SERIF,
  SERIF_I,
  SERIF_B,
  SERIF_BI,
  SANS_SERIF,
  SANS_SERIF_I,
  SANS_SERIF_B,
  SANS_SERIF_BI,
  MONOSPACE,
  MONOSPACE_I,
  MONOSPACE_B,
  MONOSPACE_BI,
  CURSIVE,
  CURSIVE_I,
  CURSIVE_B,
  CURSIVE_BI,
  OPEN_DYSLEXIC,
  OPEN_DYSLEXIC_I,
  OPEN_DYSLEXIC_B,
  OPEN_DYSLEXIC_BI,
];

function fontName(family: string, weight: FontWeight, style: FontStyle): string {
  let w = "Regular";
  switch (weight) {
    case "100":
      w = "Thin";
      break;
    case "200":
      w = "Extra Light";
      break;
    case "300":
      w = "Light";
      break;
    case "400":
      w = "Regular";
      break;
    case "500":
      w = "Medium";
      break;
    case "600":
      w = "Semi Bold";
      break;
    case "700":
      w = "Bold";
      break;
    case "800":
      w = "Extra Bold";
      break;
    case "900":
      w = "Black";
      break;
  }
  let s = "Regular";
  switch (style) {
    case "normal":
      s = "Regular";
      break;
    case "italic":
      s = "Italic";
      break;
  }
  if (w === "Regular" && s === "Regular") {
    return `${family}`;
  }
  if (w === "Regular") {
    return `${family} (${s})`;
  }
  if (s === "Regular") {
    return `${family} (${w})`;
  }
  return `${family} (${w} ${s})`;
}
