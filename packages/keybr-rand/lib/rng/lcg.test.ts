import test from "ava";
import { LCG } from "./lcg.ts";

test("RNG accepts seed zero", (t) => {
  const random = LCG(0);

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
      0.8207141160964966, 0.8991895914077759, 0.26380741596221924,
      0.2583709955215454, 0.42385780811309814, 0.9650942087173462,
      0.1808091402053833, 0.6519886553287506, 0.7223324775695801,
      0.956657886505127,
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
      0.8207141160964966, 0.8991895914077759, 0.26380741596221924,
      0.2583709955215454, 0.42385780811309814, 0.9650942087173462,
      0.1808091402053833, 0.6519886553287506, 0.7223324775695801,
      0.956657886505127,
    ],
  );
});

test("RNG generates random values", (t) => {
  const random = LCG(123);
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
