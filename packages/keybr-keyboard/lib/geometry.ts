import { Enum, type EnumItem } from "@keybr/lang";
import {
  STANDARD_MOD,
  SYMMETRIC_MOD,
  type ZoneModDict,
} from "./geometry/mod.ts";

export class ZoneMod implements EnumItem {
  static readonly STANDARD = new ZoneMod(
    "standard", //
    "Standard",
    STANDARD_MOD,
  );
  static readonly SYMMETRIC = new ZoneMod(
    "symmetric",
    "Symmetric",
    SYMMETRIC_MOD,
  );

  static readonly ALL = new Enum<ZoneMod>(
    ZoneMod.STANDARD, //
    ZoneMod.SYMMETRIC,
  );

  static first(items: Iterable<ZoneMod>): ZoneMod {
    return items[Symbol.iterator]().next().value ?? ZoneMod.STANDARD;
  }

  private constructor(
    readonly id: string,
    readonly name: string,
    readonly mod: ZoneModDict,
  ) {}

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}

export class Geometry implements EnumItem {
  static readonly ANSI_101 = new Geometry(
    "ansi101", //
    "ANSI 101",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly ANSI_101_FULL = new Geometry(
    "ansi101full", //
    "ANSI 101 (Full)",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly ISO_102 = new Geometry(
    "iso102", //
    "ISO 102",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly ISO_102_FULL = new Geometry(
    "iso102full", //
    "ISO 102 (Full)",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly KOREAN_103 = new Geometry(
    "kr103", //
    "Korean 103",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly KOREAN_103_FULL = new Geometry(
    "kr103full", //
    "Korean 103 (Full)",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly BRAZILIAN_104 = new Geometry(
    "br104", //
    "Brazilian 104",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly BRAZILIAN_104_FULL = new Geometry(
    "br104full", //
    "Brazilian 104 (Full)",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly JAPANESE_106 = new Geometry(
    "jp106", //
    "Japanese 106",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly JAPANESE_106_FULL = new Geometry(
    "jp106full", //
    "Japanese 106 (Full)",
    "staggered",
    ZoneMod.ALL,
  );
  static readonly MATRIX = new Geometry(
    "matrix", //
    "Matrix/Ergonomic",
    "matrix",
    new Enum(),
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

  static first(items: Iterable<Geometry>): Geometry {
    return items[Symbol.iterator]().next().value ?? Geometry.ANSI_101;
  }

  private constructor(
    readonly id: string,
    readonly name: string,
    readonly form: "staggered" | "matrix",
    readonly zones: Enum<ZoneMod>,
  ) {}

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}
