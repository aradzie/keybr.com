import { notStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { assert } from "chai";
import { generateName } from "./index.ts";

test("generate names", () => {
  for (let i = 0; i < 100; i++) {
    assert.isTrue(generateName().length > 0);
    assert.isTrue(
      generateName({
        capitalize: true,
      }).length > 0,
    );
    assert.isTrue(
      generateName({
        capitalize: false,
      }).length > 0,
    );
  }
});

test("generate names from seed", (t) => {
  strictEqual(generateName({ seed: 123 }), generateName({ seed: 123 }));
  notStrictEqual(generateName({ seed: 123 }), generateName({ seed: 456 }));
});
