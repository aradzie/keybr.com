import { Enum, type EnumItem } from "@keybr/lang";
import { type FontFace, FONTS_FACES, UBUNTU_MONO } from "@keybr/themes";
import { type CSSProperties } from "react";

export class Font implements EnumItem {
  static readonly ALL = new Enum<Font>(
    ...FONTS_FACES.map((fontFace) => new Font(fontFace)),
  );

  static get default() {
    return (
      Font.ALL.find(({ name }) => name === UBUNTU_MONO.name) ?? Font.ALL.at(0)
    );
  }

  readonly id: string;
  readonly name: string;
  readonly cssProperties: CSSProperties;

  private constructor(fontFace: FontFace) {
    this.id = `${fontFace.family}-${fontFace.weight}-${fontFace.style}`;
    this.name = fontFace.name;
    this.cssProperties = Object.freeze({ ...fontFace.cssProperties });
    Object.freeze(this);
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}
