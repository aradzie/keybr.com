import test from "ava";
import {
  all,
  booleanValue,
  clamp,
  enumValue,
  maxLength,
  minLength,
  numberValue,
  stringValue,
} from "./json.ts";

test("boolean value", (t) => {
  const v = booleanValue("key", true);

  t.is(v.toJson(false), false);
  t.is(v.toJson(true), true);

  t.is(v.fromJson(false), false);
  t.is(v.fromJson(true), true);
  t.is(v.fromJson("false"), true);
  t.is(v.fromJson(null), true);
});

test("number value", (t) => {
  const v = numberValue("key", 10, clamp(1, 10));

  t.is(v.toJson(1), 1);
  t.is(v.toJson(2), 2);
  t.is(v.toJson(20), 10);

  t.is(v.fromJson(1), 1);
  t.is(v.fromJson(2), 2);
  t.is(v.fromJson(20), 10);
  t.is(v.fromJson("20"), 10);
  t.is(v.fromJson(null), 10);
});

test("string value", (t) => {
  const v = stringValue("key", "zero");

  t.is(v.toJson(" "), " ");
  t.is(v.toJson("one"), "one");
  t.is(v.toJson("two"), "two");

  t.is(v.fromJson(" "), " ");
  t.is(v.fromJson("one"), "one");
  t.is(v.fromJson("two"), "two");
  t.is(v.fromJson(1000), "zero");
  t.is(v.fromJson(null), "zero");
});

test("enum value", (t) => {
  enum Numbers {
    One = 1,
    Two = 2,
    Three = 3,
  }

  const v = enumValue("key", Numbers, Numbers.Three);

  t.is(v.toJson(Numbers.One), "one");
  t.is(v.toJson(Numbers.Two), "two");
  t.is(v.toJson(Numbers.Three), "three");
  t.is(v.toJson(0), null);

  t.is(v.fromJson("one"), 1);
  t.is(v.fromJson("ONE"), 1);
  t.is(v.fromJson("two"), 2);
  t.is(v.fromJson("Two"), 2);
  t.is(v.fromJson("xyz"), 3);
  t.is(v.fromJson("zero"), 3);
  t.is(v.fromJson(null), 3);
});

test("validate", (t) => {
  const v = stringValue("key", "x", all(minLength(1), maxLength(3)));

  t.is(v.fromJson(""), "x");
  t.is(v.fromJson("x"), "x");
  t.is(v.fromJson("xy"), "xy");
  t.is(v.fromJson("xyz"), "xyz");
  t.is(v.fromJson("long"), "x");
});
