import { Enum, type EnumItem } from "@keybr/lang";

export class Geometry implements EnumItem {
  static readonly STANDARD_101 = new Geometry("standard101", "Standard 101");
  static readonly STANDARD_101_FULL = new Geometry(
    "standard101full",
    "Standard 101 (Full)",
  );
  static readonly STANDARD_102 = new Geometry("standard102", "Standard 102");
  static readonly STANDARD_102_FULL = new Geometry(
    "standard102full",
    "Standard 102 (Full)",
  );
  static readonly JAPANESE_106 = new Geometry("japanese106", "Japanese 106");
  static readonly JAPANESE_106_FULL = new Geometry(
    "japanese106full",
    "Japanese 106 (Full)",
  );
  static readonly MATRIX = new Geometry("matrix", "Matrix/Ergonomic");

  static readonly ALL = new Enum<Geometry>(
    Geometry.STANDARD_101,
    Geometry.STANDARD_101_FULL,
    Geometry.STANDARD_102,
    Geometry.STANDARD_102_FULL,
    Geometry.JAPANESE_106,
    Geometry.JAPANESE_106_FULL,
    Geometry.MATRIX,
  );

  private constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}
