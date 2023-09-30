import { Enum, type EnumItem } from "@keybr/lang";

export class SpeedUnit implements EnumItem {
  static readonly WPM = new SpeedUnit("wpm", (cpm: number): number => cpm / 5);
  static readonly CPM = new SpeedUnit("cpm", (cpm: number): number => cpm);
  static readonly CPS = new SpeedUnit("cps", (cpm: number): number => cpm / 60);
  static readonly ALL = new Enum<SpeedUnit>(
    SpeedUnit.WPM,
    SpeedUnit.CPM,
    SpeedUnit.CPS,
  );

  private constructor(
    readonly id: string,
    readonly measure: (cpm: number) => number,
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
