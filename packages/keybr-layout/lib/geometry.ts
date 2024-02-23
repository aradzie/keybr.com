import { Enum, type EnumItem } from "@keybr/lang";

export class Geometry implements EnumItem {
  static readonly STANDARD_101 = new Geometry(
    "standard101", //
    "Standard 101",
  );
  static readonly STANDARD_101_FULL = new Geometry(
    "standard101full", //
    "Standard 101 (Full)",
  );
  static readonly STANDARD_102 = new Geometry(
    "standard102", //
    "Standard 102",
  );
  static readonly STANDARD_102_FULL = new Geometry(
    "standard102full", //
    "Standard 102 (Full)",
  );
  static readonly KOREAN_103 = new Geometry(
    "kr103", //
    "Korean 103",
  );
  static readonly KOREAN_103_FULL = new Geometry(
    "kr103full", //
    "Korean 103 (Full)",
  );
  static readonly BRAZILIAN_104 = new Geometry(
    "br104", //
    "Brazilian 104",
  );
  static readonly BRAZILIAN_104_FULL = new Geometry(
    "br104full", //
    "Brazilian 104 (Full)",
  );
  static readonly JAPANESE_106 = new Geometry(
    "jp106", //
    "Japanese 106",
  );
  static readonly JAPANESE_106_FULL = new Geometry(
    "jp106full", //
    "Japanese 106 (Full)",
  );
  static readonly MATRIX = new Geometry(
    "matrix", //
    "Matrix/Ergonomic",
  );

  static readonly ALL = new Enum<Geometry>(
    Geometry.STANDARD_101,
    Geometry.STANDARD_101_FULL,
    Geometry.STANDARD_102,
    Geometry.STANDARD_102_FULL,
    Geometry.KOREAN_103,
    Geometry.KOREAN_103_FULL,
    Geometry.BRAZILIAN_104,
    Geometry.BRAZILIAN_104_FULL,
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
