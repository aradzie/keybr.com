import { Enum, type EnumItem } from "@keybr/lang";
import test from "ava";
import {
  booleanProp,
  enumProp,
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
} as const;

test("change props", (t) => {
  let settings = new Settings();

  t.is(settings.get(props.boolean), false);
  t.is(settings.get(props.number), 0);
  t.is(settings.get(props.string), "");
  t.is(settings.get(props.enum), Letter.None);
  t.is(settings.get(props.item), Digit.NONE);

  t.deepEqual(settings.toJSON(), {});

  settings = settings
    .set(props.boolean, true)
    .set(props.number, 1000)
    .set(props.string, "abcxyz")
    .set(props.enum, Letter.A)
    .set(props.item, Digit.ONE);

  t.is(settings.get(props.boolean), true);
  t.is(settings.get(props.number), 100);
  t.is(settings.get(props.string), "abc");
  t.is(settings.get(props.enum), Letter.A);
  t.is(settings.get(props.item), Digit.ONE);

  t.deepEqual(settings.toJSON(), {
    "prop.boolean": true,
    "prop.number": 100,
    "prop.string": "abc",
    "prop.enum": "a",
    "prop.item": "one",
  });
});

test("read boolean", (t) => {
  const p = props.boolean;
  t.is(new Settings().get(p), false);
  t.is(new Settings({ [p.key]: null }).get(p), false);
  t.is(new Settings({ [p.key]: "abc" }).get(p), false);
  t.is(new Settings({ [p.key]: true }).get(p), true);
});

test("read number", (t) => {
  const p = props.number;
  t.is(new Settings().get(p), 0);
  t.is(new Settings({ [p.key]: null }).get(p), 0);
  t.is(new Settings({ [p.key]: "abc" }).get(p), 0);
  t.is(new Settings({ [p.key]: 1000 }).get(p), 100);
  t.is(new Settings({ [p.key]: 99 }).get(p), 99);
});

test("read string", (t) => {
  const p = props.string;
  t.is(new Settings().get(p), "");
  t.is(new Settings({ [p.key]: null }).get(p), "");
  t.is(new Settings({ [p.key]: 123 }).get(p), "");
  t.is(new Settings({ [p.key]: "abcxyz" }).get(p), "abc");
  t.is(new Settings({ [p.key]: "123" }).get(p), "123");
});

test("read enum", (t) => {
  const p = props.enum;
  t.is(new Settings().get(p), Letter.None);
  t.is(new Settings({ [p.key]: null }).get(p), Letter.None);
  t.is(new Settings({ [p.key]: 123 }).get(p), Letter.None);
  t.is(new Settings({ [p.key]: "abc" }).get(p), Letter.None);
  t.is(new Settings({ [p.key]: "a" }).get(props.enum), Letter.A);
  t.is(new Settings({ [p.key]: "b" }).get(props.enum), Letter.B);
});

test("read item", (t) => {
  const p = props.item;
  t.is(new Settings().get(p), Digit.NONE);
  t.is(new Settings({ [p.key]: null }).get(p), Digit.NONE);
  t.is(new Settings({ [p.key]: 123 }).get(p), Digit.NONE);
  t.is(new Settings({ [p.key]: "abc" }).get(p), Digit.NONE);
  t.is(new Settings({ [p.key]: "one" }).get(p), Digit.ONE);
  t.is(new Settings({ [p.key]: "two" }).get(p), Digit.TWO);
});
