import test from "ava";
import { stringProp } from "./props.ts";
import { Settings } from "./settings.ts";

test("validate arguments", (t) => {
  // @ts-expect-error Test invalid arguments.
  t.throws(() => new Settings(null));
  // @ts-expect-error Test invalid arguments.
  t.throws(() => new Settings([]));
  // @ts-expect-error Test invalid arguments.
  t.throws(() => new Settings(new Map()));
});

test("defaults", (t) => {
  const a = stringProp("prop.a", "a");
  const b = stringProp("prop.b", "b");
  const c = stringProp("prop.c", "c");

  t.is(new Settings().get(a), "a");
  t.is(new Settings().get(b), "b");
  t.is(new Settings().get(c), "c");

  Settings.addDefaults(new Settings().set(a, "a0"));
  Settings.addDefaults(new Settings().set(b, "b0"));
  Settings.addDefaults(new Settings().set(a, "a1"));

  t.is(new Settings().get(a), "a1");
  t.is(new Settings().get(b), "b0");
  t.is(new Settings().get(c), "c");

  t.deepEqual(
    Object.keys(
      new Settings() //
        .set(b, "b0")
        .set(c, "c")
        .toJSON(),
    ),
    ["prop.b", "prop.c"],
  );
});

test("to json sorts keys", (t) => {
  const x = stringProp("prop.x", "x");
  const y = stringProp("prop.y", "y");
  const z = stringProp("prop.z", "z");

  t.deepEqual(
    Object.keys(
      new Settings() //
        .set(z, "3")
        .set(x, "1")
        .set(y, "2")
        .toJSON(),
    ),
    ["prop.x", "prop.y", "prop.z"],
  );
});
