import { Enum, type EnumItem } from "@keybr/lang";

export class Geometry implements EnumItem {
  static readonly ANSI_101 = new Geometry(
    "ansi101", //
    "ANSI 101",
    "staggered",
  );
  static readonly ANSI_101_FULL = new Geometry(
    "ansi101full", //
    "ANSI 101 (Full)",
    "staggered",
  );
  static readonly ISO_102 = new Geometry(
    "iso102", //
    "ISO 102",
    "staggered",
  );
  static readonly ISO_102_FULL = new Geometry(
    "iso102full", //
    "ISO 102 (Full)",
    "staggered",
  );
  static readonly KOREAN_103 = new Geometry(
    "kr103", //
    "Korean 103",
    "staggered",
  );
  static readonly KOREAN_103_FULL = new Geometry(
    "kr103full", //
    "Korean 103 (Full)",
    "staggered",
  );
  static readonly BRAZILIAN_104 = new Geometry(
    "br104", //
    "Brazilian 104",
    "staggered",
  );
  static readonly BRAZILIAN_104_FULL = new Geometry(
    "br104full", //
    "Brazilian 104 (Full)",
    "staggered",
  );
  static readonly JAPANESE_106 = new Geometry(
    "jp106", //
    "Japanese 106",
    "staggered",
  );
  static readonly JAPANESE_106_FULL = new Geometry(
    "jp106full", //
    "Japanese 106 (Full)",
    "staggered",
  );
  static readonly MATRIX = new Geometry(
    "matrix", //
    "Matrix/Ergonomic",
    "matrix",
  );

  static readonly ALL = new Enum<Geometry>(
    Geometry.ANSI_101,
    Geometry.ANSI_101_FULL,
    Geometry.ISO_102,
    Geometry.ISO_102_FULL,
    Geometry.KOREAN_103,
    Geometry.KOREAN_103_FULL,
    Geometry.BRAZILIAN_104,
    Geometry.BRAZILIAN_104_FULL,
    Geometry.JAPANESE_106,
    Geometry.JAPANESE_106_FULL,
    Geometry.MATRIX,
  );

  private constructor(
    readonly id: string,
    readonly name: string,
    readonly form: "staggered" | "matrix",
  ) {}

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}
