import type { CSSProperties } from "react";

export type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export type FontStyle = "normal" | "italic";

export class FontFace {
  readonly family: string;
  readonly weight: FontWeight;
  readonly style: FontStyle;
  readonly name: string;
  readonly cssProperties: CSSProperties;

  constructor(family: string, weight: FontWeight, style: FontStyle) {
    this.family = family;
    this.weight = weight;
    this.style = style;
    this.name = fontName(family, weight, style);
    this.cssProperties = {
      fontFamily: family,
      fontWeight: weight,
      fontStyle: style,
    };
  }
}

export const NUNITO = new FontFace("Nunito", "400", "normal");
export const NUNITO_I = new FontFace("Nunito", "400", "italic");
export const NUNITO_B = new FontFace("Nunito", "700", "normal");
export const NUNITO_BI = new FontFace("Nunito", "700", "italic");
export const OPEN_DYSLEXIC = new FontFace("Open Dyslexic", "400", "normal");
export const OPEN_DYSLEXIC_I = new FontFace("Open Dyslexic", "400", "italic");
export const OPEN_DYSLEXIC_B = new FontFace("Open Dyslexic", "700", "normal");
export const OPEN_DYSLEXIC_BI = new FontFace("Open Dyslexic", "700", "italic");
export const OPEN_SANS = new FontFace("Open Sans", "400", "normal");
export const OPEN_SANS_I = new FontFace("Open Sans", "400", "italic");
export const OPEN_SANS_B = new FontFace("Open Sans", "700", "normal");
export const OPEN_SANS_BI = new FontFace("Open Sans", "700", "italic");
export const ROBOTO = new FontFace("Roboto", "400", "normal");
export const ROBOTO_I = new FontFace("Roboto", "400", "italic");
export const ROBOTO_B = new FontFace("Roboto", "700", "normal");
export const ROBOTO_BI = new FontFace("Roboto", "700", "italic");
export const ROBOTO_MONO = new FontFace("Roboto Mono", "400", "normal");
export const ROBOTO_MONO_I = new FontFace("Roboto Mono", "400", "italic");
export const ROBOTO_MONO_B = new FontFace("Roboto Mono", "700", "normal");
export const ROBOTO_MONO_BI = new FontFace("Roboto Mono", "700", "italic");
export const SPECTRAL = new FontFace("Spectral", "400", "normal");
export const SPECTRAL_I = new FontFace("Spectral", "400", "italic");
export const SPECTRAL_B = new FontFace("Spectral", "700", "normal");
export const SPECTRAL_BI = new FontFace("Spectral", "700", "italic");
export const UBUNTU = new FontFace("Ubuntu", "400", "normal");
export const UBUNTU_I = new FontFace("Ubuntu", "400", "italic");
export const UBUNTU_B = new FontFace("Ubuntu", "700", "normal");
export const UBUNTU_BI = new FontFace("Ubuntu", "700", "italic");
export const UBUNTU_MONO = new FontFace("Ubuntu Mono", "400", "normal");
export const UBUNTU_MONO_I = new FontFace("Ubuntu Mono", "400", "italic");
export const UBUNTU_MONO_B = new FontFace("Ubuntu Mono", "700", "normal");
export const UBUNTU_MONO_BI = new FontFace("Ubuntu Mono", "700", "italic");

export const FONTS_FACES: readonly FontFace[] = [
  NUNITO,
  NUNITO_I,
  NUNITO_B,
  NUNITO_BI,
  OPEN_DYSLEXIC,
  OPEN_DYSLEXIC_I,
  OPEN_DYSLEXIC_B,
  OPEN_DYSLEXIC_BI,
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
];

function fontName(
  family: string,
  weight: FontWeight,
  style: FontStyle,
): string {
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
