import { test } from "node:test";
import { equal, isTrue, notEqual } from "rich-assert";
import { generateName } from "./index.ts";

test("generate names", () => {
  for (let i = 0; i < 100; i++) {
    isTrue(generateName().length > 0);
    isTrue(
      generateName({
        capitalize: true,
      }).length > 0,
    );
    isTrue(
      generateName({
        capitalize: false,
      }).length > 0,
    );
  }
});

test("generate names from seed", () => {
  equal(generateName({ seed: 123 }), generateName({ seed: 123 }));
  notEqual(generateName({ seed: 123 }), generateName({ seed: 456 }));
});
