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

test("to json sorts keys", (t) => {
  t.deepEqual(
    Object.keys(
      new Settings()
        .set(stringProp("prop.c", "c"), "3")
        .set(stringProp("prop.a", "a"), "1")
        .set(stringProp("prop.b", "b"), "2")
        .toJSON(),
    ),
    ["prop.a", "prop.b", "prop.c"],
  );
});
