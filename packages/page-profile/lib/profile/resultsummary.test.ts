import { LocalDate, makeSummaryStats, ResultFaker } from "@keybr/result";
import test from "ava";
import { ResultSummary } from "./resultsummary.ts";

test("no results", (t) => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);

  // Act.

  const summary = new ResultSummary([], today);
  const groups = [...summary];

  // Assert.

  t.is(groups.length, 0);
  t.deepEqual(summary.todayStats, {
    date: today,
    results: [],
    stats: makeSummaryStats([]),
  });
  t.false(summary.has(today));
});

test("no results today", (t) => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });

  // Act.

  const summary = new ResultSummary([r1], today);
  const groups = [...summary];

  // Assert.

  t.is(groups.length, 1);
  const [g0] = groups;
  t.deepEqual(g0, {
    date: yesterday,
    results: [r1],
    stats: makeSummaryStats([r1]),
  });
  t.deepEqual(summary.todayStats, {
    date: today,
    results: [],
    stats: makeSummaryStats([]),
  });
  t.false(groups.includes(summary.todayStats));
  t.true(summary.has(yesterday));
  t.false(summary.has(today));
});

test("group results group by date", (t) => {
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

  t.is(groups.length, 2);
  const [g0, g1] = groups;
  t.deepEqual(g0, {
    date: yesterday,
    results: [r1],
    stats: makeSummaryStats([r1]),
  });
  t.deepEqual(g1, {
    date: today,
    results: [r2],
    stats: makeSummaryStats([r2]),
  });
  t.deepEqual(summary.todayStats, {
    date: today,
    results: [r2],
    stats: makeSummaryStats([r2]),
  });
  t.true(groups.includes(summary.todayStats));
  t.true(summary.has(yesterday));
  t.true(summary.has(today));
});
