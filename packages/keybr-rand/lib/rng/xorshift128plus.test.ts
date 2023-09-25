import test from "ava";
import { XorShift128Plus } from "./xorshift128plus.ts";

test("RNG accepts seed zero", (t) => {
  const random = XorShift128Plus(0);

  const mark = random.mark();

  t.deepEqual(
    [
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
    ],
    [
      0.8188071976512541, 0.35284151104863315, 0.1154818549470662,
      0.3231400085839691, 0.30933229322965183, 0.7985074772781063,
      0.8558122627970669, 0.16525380253246813, 0.432012156897983,
      0.1099219469360031,
    ],
  );

  random.reset(mark);

  t.deepEqual(
    [
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
      random(),
    ],
    [
      0.8188071976512541, 0.35284151104863315, 0.1154818549470662,
      0.3231400085839691, 0.30933229322965183, 0.7985074772781063,
      0.8558122627970669, 0.16525380253246813, 0.432012156897983,
      0.1099219469360031,
    ],
  );
});

test("RNG generates random values", (t) => {
  const random = XorShift128Plus(123);
  const values = new Set<number>();
  for (let i = 0; i < 10000; i++) {
    const value = random();
    t.true(!Number.isNaN(value));
    t.true(value >= 0);
    t.true(value < 1);
    t.false(values.has(value));
    values.add(value);
  }
});
