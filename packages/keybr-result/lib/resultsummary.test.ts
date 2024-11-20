import { test } from "node:test";
import { deepEqual, equal, isFalse, isTrue } from "rich-assert";
import { ResultFaker } from "./fake.tsx";
import { LocalDate } from "./localdate.ts";
import { ResultSummary } from "./resultsummary.ts";
import { makeSummaryStats } from "./summarystats.ts";

test("no results", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);

  // Act.

  const summary = new ResultSummary([], today);
  const groups = [...summary];

  // Assert.

  equal(groups.length, 0);
  deepEqual(summary.todayStats, {
    date: today,
    results: [],
    stats: makeSummaryStats([]),
  });
  isFalse(summary.has(today));
});

test("no results today", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });

  // Act.

  const summary = new ResultSummary([r1], today);
  const groups = [...summary];

  // Assert.

  equal(groups.length, 1);
  const [g0] = groups;
  deepEqual(g0, {
    date: yesterday,
    results: [r1],
    stats: makeSummaryStats([r1]),
  });
  deepEqual(summary.todayStats, {
    date: today,
    results: [],
    stats: makeSummaryStats([]),
  });
  isFalse(groups.includes(summary.todayStats));
  isTrue(summary.has(yesterday));
  isFalse(summary.has(today));
});

test("group results group by date", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });
  const r2 = faker.nextResult({ timeStamp: today.timeStamp });

  // Act.

  const summary = new ResultSummary([r1, r2], today);
  const groups = [...summary];

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
  deepEqual(summary.todayStats, {
    date: today,
    results: [r2],
    stats: makeSummaryStats([r2]),
  });
  isTrue(groups.includes(summary.todayStats));
  isTrue(summary.has(yesterday));
  isTrue(summary.has(today));
});
