import { test } from "node:test";
import { Enum, type EnumItem } from "@keybr/lang";
import { deepEqual, equal } from "rich-assert";
import {
  booleanProp,
  enumProp,
  flagsProp,
  itemProp,
  numberProp,
  stringProp,
} from "./props.ts";
import { Settings } from "./settings.ts";

enum Letter {
  None = 0,
  A = 1,
  B = 2,
}

class Digit implements EnumItem {
  static readonly NONE = new Digit("none");
  static readonly ONE = new Digit("one");
  static readonly TWO = new Digit("two");

  static readonly ALL = new Enum<Digit>(Digit.NONE, Digit.ONE, Digit.TWO);

  constructor(readonly id: string) {
    Object.freeze(this);
  }

  toString() {
    return this.id;
  }

  toJSON() {
    return this.id;
  }
}

const props = {
  boolean: booleanProp("prop.boolean", false),
  number: numberProp("prop.number", 0, { min: 0, max: 100 }),
  string: stringProp("prop.string", "", { maxLength: 3 }),
  enum: enumProp("prop.enum", Letter, Letter.None),
  item: itemProp("prop.item", Digit.ALL, Digit.NONE),
  flags: flagsProp("prop.flags", ["a", "b", "c"]),
} as const;

test("change props", () => {
  let settings = new Settings();

  equal(settings.get(props.boolean), false);
  equal(settings.get(props.number), 0);
  equal(settings.get(props.string), "");
  equal(settings.get(props.enum), Letter.None);
  equal(settings.get(props.item), Digit.NONE);
  deepEqual(settings.get(props.flags), ["a", "b", "c"]);

  deepEqual(settings.toJSON(), {});

  settings = settings
    .set(props.boolean, true)
    .set(props.number, 1000)
    .set(props.string, "abcxyz")
    .set(props.enum, Letter.A)
    .set(props.item, Digit.ONE)
    .set(props.flags, ["a", "x"]);

  equal(settings.get(props.boolean), true);
  equal(settings.get(props.number), 100);
  equal(settings.get(props.string), "abc");
  equal(settings.get(props.enum), Letter.A);
  equal(settings.get(props.item), Digit.ONE);
  deepEqual(settings.get(props.flags), ["a"]);

  deepEqual(settings.toJSON(), {
    "prop.boolean": true,
    "prop.number": 100,
    "prop.string": "abc",
    "prop.enum": "a",
    "prop.item": "one",
    "prop.flags": "a",
  });
});

test("read boolean", () => {
  const p = props.boolean;
  equal(new Settings().get(p), false);
  equal(new Settings().get(p, true), true);
  equal(new Settings({ [p.key]: null }).get(p), false);
  equal(new Settings({ [p.key]: null }).get(p, true), true);
  equal(new Settings({ [p.key]: "abc" }).get(p), false);
  equal(new Settings({ [p.key]: "abc" }).get(p, true), true);
  equal(new Settings({ [p.key]: true }).get(p), true);
});

test("read number", () => {
  const p = props.number;
  equal(new Settings().get(p), 0);
  equal(new Settings().get(p, 1), 1);
  equal(new Settings({ [p.key]: null }).get(p), 0);
  equal(new Settings({ [p.key]: null }).get(p, 1), 1);
  equal(new Settings({ [p.key]: "abc" }).get(p), 0);
  equal(new Settings({ [p.key]: "abc" }).get(p, 1), 1);
  equal(new Settings({ [p.key]: 1000 }).get(p), 100);
  equal(new Settings({ [p.key]: 99 }).get(p), 99);
});

test("read string", () => {
  const p = props.string;
  equal(new Settings().get(p), "");
  equal(new Settings().get(p, "abc"), "abc");
  equal(new Settings({ [p.key]: null }).get(p), "");
  equal(new Settings({ [p.key]: null }).get(p, "abc"), "abc");
  equal(new Settings({ [p.key]: 123 }).get(p), "");
  equal(new Settings({ [p.key]: 123 }).get(p, "abc"), "abc");
  equal(new Settings({ [p.key]: "abcxyz" }).get(p), "abc");
  equal(new Settings({ [p.key]: "123" }).get(p), "123");
});

test("read enum", () => {
  const p = props.enum;
  equal(new Settings().get(p), Letter.None);
  equal(new Settings().get(p, Letter.A), Letter.A);
  equal(new Settings({ [p.key]: null }).get(p), Letter.None);
  equal(new Settings({ [p.key]: null }).get(p, Letter.A), Letter.A);
  equal(new Settings({ [p.key]: 123 }).get(p), Letter.None);
  equal(new Settings({ [p.key]: 123 }).get(p, Letter.A), Letter.A);
  equal(new Settings({ [p.key]: "abc" }).get(p), Letter.None);
  equal(new Settings({ [p.key]: "abc" }).get(p, Letter.A), Letter.A);
  equal(new Settings({ [p.key]: "a" }).get(props.enum), Letter.A);
  equal(new Settings({ [p.key]: "b" }).get(props.enum), Letter.B);
});

test("read item", () => {
  const p = props.item;
  equal(new Settings().get(p), Digit.NONE);
  equal(new Settings().get(p, Digit.ONE), Digit.ONE);
  equal(new Settings({ [p.key]: null }).get(p), Digit.NONE);
  equal(new Settings({ [p.key]: null }).get(p, Digit.ONE), Digit.ONE);
  equal(new Settings({ [p.key]: 123 }).get(p), Digit.NONE);
  equal(new Settings({ [p.key]: 123 }).get(p, Digit.ONE), Digit.ONE);
  equal(new Settings({ [p.key]: "abc" }).get(p), Digit.NONE);
  equal(new Settings({ [p.key]: "abc" }).get(p, Digit.ONE), Digit.ONE);
  equal(new Settings({ [p.key]: "one" }).get(p), Digit.ONE);
  equal(new Settings({ [p.key]: "two" }).get(p), Digit.TWO);
});

test("read flags", () => {
  const p = props.flags;
  deepEqual(
    new Settings().get(p), //
    ["a", "b", "c"],
  );
  deepEqual(
    new Settings().get(p, ["a"]), //
    ["a"],
  );
  deepEqual(
    new Settings({ [p.key]: null }).get(p), //
    ["a", "b", "c"],
  );
  deepEqual(
    new Settings({ [p.key]: null }).get(p, ["a"]), //
    ["a"],
  );
  deepEqual(
    new Settings({ [p.key]: 123 }).get(p), //
    ["a", "b", "c"],
  );
  deepEqual(
    new Settings({ [p.key]: 123 }).get(p, ["a"]), //
    ["a"],
  );
  deepEqual(
    new Settings({ [p.key]: "a" }).get(p), //
    ["a"],
  );
  deepEqual(
    new Settings({ [p.key]: "b" }).get(p), //
    ["b"],
  );
  deepEqual(
    new Settings({ [p.key]: "a,b,c,x" }).get(p), //
    ["a", "b", "c"],
  );
});
