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
  const json = Object.create(null);
  const settings = new Settings(json);

  t.is(settings.get(props.boolean), false);

  json[props.boolean.key] = null;
  t.is(settings.get(props.boolean), false);

  json[props.boolean.key] = "abc";
  t.is(settings.get(props.boolean), false);

  json[props.boolean.key] = true;
  t.is(settings.get(props.boolean), true);
});

test("read number", (t) => {
  const json = Object.create(null);
  const settings = new Settings(json);

  t.is(settings.get(props.number), 0);

  json[props.number.key] = null;
  t.is(settings.get(props.number), 0);

  json[props.number.key] = "abc";
  t.is(settings.get(props.number), 0);

  json[props.number.key] = 1000;
  t.is(settings.get(props.number), 100);

  json[props.number.key] = 99;
  t.is(settings.get(props.number), 99);
});

test("read string", (t) => {
  const json = Object.create(null);
  const settings = new Settings(json);

  t.is(settings.get(props.string), "");

  json[props.string.key] = null;
  t.is(settings.get(props.string), "");

  json[props.string.key] = 123;
  t.is(settings.get(props.string), "");

  json[props.string.key] = "abcxyz";
  t.is(settings.get(props.string), "abc");

  json[props.string.key] = "123";
  t.is(settings.get(props.string), "123");
});

test("read enum", (t) => {
  const json = Object.create(null);
  const settings = new Settings(json);

  t.is(settings.get(props.enum), Letter.None);

  json[props.enum.key] = null;
  t.is(settings.get(props.enum), Letter.None);

  json[props.enum.key] = 123;
  t.is(settings.get(props.enum), Letter.None);

  json[props.enum.key] = "abc";
  t.is(settings.get(props.enum), Letter.None);

  json[props.enum.key] = "a";
  t.is(settings.get(props.enum), Letter.A);

  json[props.enum.key] = "b";
  t.is(settings.get(props.enum), Letter.B);
});

test("read item", (t) => {
  const json = Object.create(null);
  const settings = new Settings(json);

  t.is(settings.get(props.item), Digit.NONE);

  json[props.item.key] = null;
  t.is(settings.get(props.item), Digit.NONE);

  json[props.item.key] = 123;
  t.is(settings.get(props.item), Digit.NONE);

  json[props.item.key] = "abc";
  t.is(settings.get(props.item), Digit.NONE);

  json[props.item.key] = "one";
  t.is(settings.get(props.item), Digit.ONE);

  json[props.item.key] = "two";
  t.is(settings.get(props.item), Digit.TWO);
});
