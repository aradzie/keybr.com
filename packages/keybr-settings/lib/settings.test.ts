import { test } from "node:test";
import { assert } from "chai";
import { stringProp } from "./props.ts";
import { Settings } from "./settings.ts";

test("validate arguments", () => {
  // @ts-expect-error Test invalid arguments.
  assert.throws(() => new Settings(null));
  // @ts-expect-error Test invalid arguments.
  assert.throws(() => new Settings([]));
  // @ts-expect-error Test invalid arguments.
  assert.throws(() => new Settings(new Map()));
});

test("defaults", () => {
  const a = stringProp("prop.a", "a");
  const b = stringProp("prop.b", "b");
  const c = stringProp("prop.c", "c");

  assert.strictEqual(new Settings().get(a), "a");
  assert.strictEqual(new Settings().get(b), "b");
  assert.strictEqual(new Settings().get(c), "c");

  Settings.addDefaults(new Settings().set(a, "a0"));
  Settings.addDefaults(new Settings().set(b, "b0"));
  Settings.addDefaults(new Settings().set(a, "a1"));

  assert.strictEqual(new Settings().get(a), "a1");
  assert.strictEqual(new Settings().get(b), "b0");
  assert.strictEqual(new Settings().get(c), "c");

  assert.deepStrictEqual(
    Object.keys(
      new Settings() //
        .set(b, "b0")
        .set(c, "c")
        .toJSON(),
    ),
    ["prop.b", "prop.c"],
  );
});

test("to json sorts keys", () => {
  const x = stringProp("prop.x", "x");
  const y = stringProp("prop.y", "y");
  const z = stringProp("prop.z", "z");

  assert.deepStrictEqual(
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
