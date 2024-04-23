import { Enum, type EnumItem } from "@keybr/lang";

type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

type FontStyle = "normal" | "italic";

export class Font implements EnumItem {
  static readonly NUNITO = new Font("Nunito", "400", "normal");
  static readonly NUNITO_I = new Font("Nunito", "400", "italic");
  static readonly NUNITO_B = new Font("Nunito", "700", "normal");
  static readonly NUNITO_BI = new Font("Nunito", "700", "italic");
  static readonly OPEN_DYSLEXIC = new Font("Open Dyslexic", "400", "normal");
  static readonly OPEN_DYSLEXIC_I = new Font("Open Dyslexic", "400", "italic");
  static readonly OPEN_DYSLEXIC_B = new Font("Open Dyslexic", "700", "normal");
  static readonly OPEN_DYSLEXIC_BI = new Font("Open Dyslexic", "700", "italic");
  static readonly OPEN_SANS = new Font("Open Sans", "400", "normal");
  static readonly OPEN_SANS_I = new Font("Open Sans", "400", "italic");
  static readonly OPEN_SANS_B = new Font("Open Sans", "700", "normal");
  static readonly OPEN_SANS_BI = new Font("Open Sans", "700", "italic");
  static readonly ROBOTO_MONO = new Font("Roboto Mono", "400", "normal");
  static readonly ROBOTO_MONO_I = new Font("Roboto Mono", "400", "italic");
  static readonly ROBOTO_MONO_B = new Font("Roboto Mono", "700", "normal");
  static readonly ROBOTO_MONO_BI = new Font("Roboto Mono", "700", "italic");
  static readonly SPECTRAL = new Font("Spectral", "400", "normal");
  static readonly SPECTRAL_I = new Font("Spectral", "400", "italic");
  static readonly SPECTRAL_B = new Font("Spectral", "700", "normal");
  static readonly SPECTRAL_BI = new Font("Spectral", "700", "italic");
  static readonly UBUNTU_MONO = new Font("Ubuntu Mono", "400", "normal");
  static readonly UBUNTU_MONO_I = new Font("Ubuntu Mono", "400", "italic");
  static readonly UBUNTU_MONO_B = new Font("Ubuntu Mono", "700", "normal");
  static readonly UBUNTU_MONO_BI = new Font("Ubuntu Mono", "700", "italic");

  static readonly ALL = new Enum<Font>(
    Font.NUNITO,
    Font.NUNITO_I,
    Font.NUNITO_B,
    Font.NUNITO_BI,
    Font.OPEN_DYSLEXIC,
    Font.OPEN_DYSLEXIC_I,
    Font.OPEN_DYSLEXIC_B,
    Font.OPEN_DYSLEXIC_BI,
    Font.OPEN_SANS,
    Font.OPEN_SANS_I,
    Font.OPEN_SANS_B,
    Font.OPEN_SANS_BI,
    Font.ROBOTO_MONO,
    Font.ROBOTO_MONO_I,
    Font.ROBOTO_MONO_B,
    Font.ROBOTO_MONO_BI,
    Font.SPECTRAL,
    Font.SPECTRAL_I,
    Font.SPECTRAL_B,
    Font.SPECTRAL_BI,
    Font.UBUNTU_MONO,
    Font.UBUNTU_MONO_I,
    Font.UBUNTU_MONO_B,
    Font.UBUNTU_MONO_BI,
  );

  readonly id: string;
  readonly family: string;
  readonly weight: FontWeight;
  readonly style: FontStyle;
  readonly name: string;
  readonly cssProperties: Record<string, any>;

  private constructor(family: string, weight: FontWeight, style: FontStyle) {
    this.id = `${family}-${weight}-${style}`;
    this.family = family;
    this.weight = weight;
    this.style = style;
    this.name = fontName(family, weight, style);
    this.cssProperties = Object.freeze({
      fontFamily: family,
      fontWeight: weight,
      fontStyle: style,
    });
    Object.freeze(this);
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}

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
