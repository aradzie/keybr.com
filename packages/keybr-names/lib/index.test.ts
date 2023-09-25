import test from "ava";
import { generateName } from "./index.ts";

test("generate names", (t) => {
  for (let i = 0; i < 100; i++) {
    t.true(generateName().length > 0);
    t.true(
      generateName({
        capitalize: true,
      }).length > 0,
    );
    t.true(
      generateName({
        capitalize: false,
      }).length > 0,
    );
  }
});

test("generate names from seed", (t) => {
  t.is(generateName({ seed: 123 }), generateName({ seed: 123 }));
  t.not(generateName({ seed: 123 }), generateName({ seed: 456 }));
});
