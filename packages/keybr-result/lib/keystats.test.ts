import { Letter } from "@keybr/phonetic-model";
import { Histogram } from "@keybr/textinput";
import test from "ava";
import { ResultFaker } from "./fake.tsx";
import { MutableKeyStatsMap } from "./keystats.ts";

test("compute key stats", (t) => {
  const faker = new ResultFaker();
  const l1 = new Letter(0x0061, 1, "A");
  const l2 = new Letter(0x0062, 1, "B");
  const r1 = faker.nextResult({
    histogram: new Histogram([
      {
        codePoint: l1.codePoint,
        hitCount: 1,
        missCount: 0,
        timeToType: 500,
      },
    ]),
  });
  const r2 = faker.nextResult({
    histogram: new Histogram([
      {
        codePoint: l2.codePoint,
        hitCount: 1,
        missCount: 0,
        timeToType: 200,
      },
    ]),
  });
  const r3 = faker.nextResult({
    histogram: new Histogram([
      {
        codePoint: l1.codePoint,
        hitCount: 1,
        missCount: 0,
        timeToType: 100,
      },
    ]),
  });

  const keyStatsMap = new MutableKeyStatsMap([l1, l2]);

  t.deepEqual(keyStatsMap.copy().get(l1), {
    letter: l1,
    samples: [],
    timeToType: null,
    bestTimeToType: null,
  });

  keyStatsMap.append(r1);

  t.deepEqual(keyStatsMap.copy().get(l1), {
    letter: l1,
    samples: [
      {
        index: 0,
        timeStamp: r1.timeStamp,
        hitCount: 1,
        missCount: 0,
        timeToType: 500,
        filteredTimeToType: 500,
      },
    ],
    timeToType: 500,
    bestTimeToType: 500,
  });

  keyStatsMap.append(r2);
  keyStatsMap.append(r3);

  t.deepEqual(keyStatsMap.copy().get(l1), {
    letter: l1,
    samples: [
      {
        index: 0,
        timeStamp: r1.timeStamp,
        hitCount: 1,
        missCount: 0,
        timeToType: 500,
        filteredTimeToType: 500,
      },
      {
        index: 2,
        timeStamp: r3.timeStamp,
        hitCount: 1,
        missCount: 0,
        timeToType: 100,
        filteredTimeToType: 460,
      },
    ],
    timeToType: 460,
    bestTimeToType: 460,
  });

  t.deepEqual(keyStatsMap.copy().get(l2), {
    letter: l2,
    samples: [
      {
        index: 1,
        timeStamp: r2.timeStamp,
        hitCount: 1,
        missCount: 0,
        timeToType: 200,
        filteredTimeToType: 200,
      },
    ],
    timeToType: 200,
    bestTimeToType: 200,
  });
});
