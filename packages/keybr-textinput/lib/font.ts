import { Enum, type EnumItem } from "@keybr/lang";

export class Font implements EnumItem {
  static readonly OPEN_SANS = new Font(
    "open-sans",
    "Open Sans",
    regular("Open Sans"),
  );
  static readonly OPEN_SANS_B = new Font(
    "open-sans-b",
    "Open Sans (Bold)",
    bold("Open Sans"),
  );
  static readonly OPEN_SANS_I = new Font(
    "open-sans-i",
    "Open Sans (Italic)",
    italic("Open Sans"),
  );
  static readonly OPEN_SANS_BI = new Font(
    "open-sans-bi",
    "Open Sans (Bold Bold)",
    boldItalic("Open Sans"),
  );
  static readonly ROBOTO_MONO = new Font(
    "roboto-mono",
    "Roboto Mono",
    regular("Roboto Mono"),
  );
  static readonly ROBOTO_MONO_B = new Font(
    "roboto-mono-b",
    "Roboto Mono (Bold)",
    bold("Roboto Mono"),
  );
  static readonly ROBOTO_MONO_I = new Font(
    "roboto-mono-i",
    "Roboto Mono (Italic)",
    italic("Roboto Mono"),
  );
  static readonly ROBOTO_MONO_BI = new Font(
    "roboto-mono-bi",
    "Roboto Mono (Bold Italic)",
    boldItalic("Roboto Mono"),
  );
  static readonly UBUNTU_MONO = new Font(
    "ubuntu-mono",
    "Ubuntu Mono",
    regular("Ubuntu Mono"),
  );
  static readonly UBUNTU_MONO_B = new Font(
    "ubuntu-mono-b",
    "Ubuntu Mono (Bold)",
    bold("Ubuntu Mono"),
  );
  static readonly UBUNTU_MONO_I = new Font(
    "ubuntu-mono-i",
    "Ubuntu Mono (Italic)",
    italic("Ubuntu Mono"),
  );
  static readonly UBUNTU_MONO_BI = new Font(
    "ubuntu-mono-bi",
    "Ubuntu Mono (Bold Italic)",
    boldItalic("Ubuntu Mono"),
  );

  static readonly ALL = new Enum<Font>(
    Font.OPEN_SANS,
    Font.OPEN_SANS_B,
    Font.OPEN_SANS_I,
    Font.OPEN_SANS_BI,
    Font.ROBOTO_MONO,
    Font.ROBOTO_MONO_B,
    Font.ROBOTO_MONO_I,
    Font.ROBOTO_MONO_BI,
    Font.UBUNTU_MONO,
    Font.UBUNTU_MONO_B,
    Font.UBUNTU_MONO_I,
    Font.UBUNTU_MONO_BI,
  );

  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly style: {
      readonly fontFamily: string;
      readonly fontWeight: string;
      readonly fontStyle: string;
    },
  ) {
    Object.freeze(this);
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}

function regular(fontFamily: string) {
  return {
    fontFamily,
    fontWeight: "400",
    fontStyle: "normal",
  };
}

function bold(fontFamily: string) {
  return {
    fontFamily,
    fontWeight: "700",
    fontStyle: "normal",
  };
}

function italic(fontFamily: string) {
  return {
    fontFamily,
    fontWeight: "400",
    fontStyle: "italic",
  };
}

function boldItalic(fontFamily: string) {
  return {
    fontFamily,
    fontWeight: "700",
    fontStyle: "italic",
  };
}
