import { Enum, type EnumItem } from "@keybr/lang";
import { defineMessage, type MessageDescriptor } from "react-intl";

export class SpeedUnit implements EnumItem {
  static readonly WPM = new SpeedUnit(
    "wpm",
    (cpm) => cpm / 5,
    defineMessage({
      id: "speedUnit.wpm.name",
      defaultMessage: "Words per minute",
    }),
  );
  static readonly WPS = new SpeedUnit(
    "wps",
    (cpm) => cpm / 300,
    defineMessage({
      id: "speedUnit.wps.name",
      defaultMessage: "Words per second",
    }),
  );
  static readonly CPM = new SpeedUnit(
    "cpm",
    (cpm) => cpm,
    defineMessage({
      id: "speedUnit.cpm.name",
      defaultMessage: "Characters per minute",
    }),
  );
  static readonly CPS = new SpeedUnit(
    "cps",
    (cpm) => cpm / 60,
    defineMessage({
      id: "speedUnit.cps.name",
      defaultMessage: "Characters per second",
    }),
  );
  static readonly ALL = new Enum<SpeedUnit>(
    SpeedUnit.WPM,
    SpeedUnit.WPS,
    SpeedUnit.CPM,
    SpeedUnit.CPS,
  );

  private constructor(
    readonly id: string,
    readonly measure: (cpm: number) => number,
    readonly name: MessageDescriptor,
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
