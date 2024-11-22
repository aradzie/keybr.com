import { test } from "node:test";
import { deepEqual, equal, isFalse, isTrue } from "rich-assert";
import { DailyStatsMap } from "./dailystats.ts";
import { ResultFaker } from "./fake.tsx";
import { LocalDate } from "./localdate.ts";
import { makeSummaryStats } from "./summarystats.ts";

test("no results", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);

  // Act.

  const map = new DailyStatsMap([], today);
  const groups = [...map];

  // Assert.

  equal(groups.length, 0);
  deepEqual(map.today, {
    date: today,
    results: [],
    stats: makeSummaryStats([]),
  });
  isFalse(map.has(today));
});

test("no results today", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });

  // Act.

  const map = new DailyStatsMap([r1], today);
  const groups = [...map];

  // Assert.

  equal(groups.length, 1);
  const [g0] = groups;
  deepEqual(g0, {
    date: yesterday,
    results: [r1],
    stats: makeSummaryStats([r1]),
  });
  deepEqual(map.today, {
    date: today,
    results: [],
    stats: makeSummaryStats([]),
  });
  isFalse(groups.includes(map.today));
  isTrue(map.has(yesterday));
  isFalse(map.has(today));
});

test("group results group by date", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });
  const r2 = faker.nextResult({ timeStamp: today.timeStamp });

  // Act.

  const map = new DailyStatsMap([r1, r2], today);
  const groups = [...map];

  // Assert.

  equal(groups.length, 2);
  const [g0, g1] = groups;
  deepEqual(g0, {
    date: yesterday,
    results: [r1],
    stats: makeSummaryStats([r1]),
  });
  deepEqual(g1, {
    date: today,
    results: [r2],
    stats: makeSummaryStats([r2]),
  });
  deepEqual(map.today, {
    date: today,
    results: [r2],
    stats: makeSummaryStats([r2]),
  });
  isTrue(groups.includes(map.today));
  isTrue(map.has(yesterday));
  isTrue(map.has(today));
});
