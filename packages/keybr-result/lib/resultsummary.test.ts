import { test } from "node:test";
import { assert } from "chai";
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

  assert.strictEqual(groups.length, 0);
  assert.deepStrictEqual(summary.todayStats, {
    date: today,
    results: [],
    stats: makeSummaryStats([]),
  });
  assert.isFalse(summary.has(today));
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

  assert.strictEqual(groups.length, 1);
  const [g0] = groups;
  assert.deepStrictEqual(g0, {
    date: yesterday,
    results: [r1],
    stats: makeSummaryStats([r1]),
  });
  assert.deepStrictEqual(summary.todayStats, {
    date: today,
    results: [],
    stats: makeSummaryStats([]),
  });
  assert.isFalse(groups.includes(summary.todayStats));
  assert.isTrue(summary.has(yesterday));
  assert.isFalse(summary.has(today));
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

  assert.strictEqual(groups.length, 2);
  const [g0, g1] = groups;
  assert.deepStrictEqual(g0, {
    date: yesterday,
    results: [r1],
    stats: makeSummaryStats([r1]),
  });
  assert.deepStrictEqual(g1, {
    date: today,
    results: [r2],
    stats: makeSummaryStats([r2]),
  });
  assert.deepStrictEqual(summary.todayStats, {
    date: today,
    results: [r2],
    stats: makeSummaryStats([r2]),
  });
  assert.isTrue(groups.includes(summary.todayStats));
  assert.isTrue(summary.has(yesterday));
  assert.isTrue(summary.has(today));
});
