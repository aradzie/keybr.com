import { test } from "node:test";
import { assert } from "chai";
import { DayOfWeek, LocalDate, Month } from "./localdate.ts";

test("validate arguments", () => {
  assert.throws(() => {
    new LocalDate(2001, 0, 1);
  });
  assert.throws(() => {
    new LocalDate(2001, 13, 1);
  });
  assert.throws(() => {
    new LocalDate(2001, 1, 0);
  });
  assert.throws(() => {
    new LocalDate(2001, 1, 32);
  });
});

test("create from timestamp", () => {
  assert.strictEqual(
    String(new LocalDate(new Date(1970, 0, 1, 11, 22, 33))),
    "1970-01-01",
  );
  assert.strictEqual(
    String(new LocalDate(new Date(2001, 1, 3, 4, 5, 6))),
    "2001-02-03",
  );
});

test("create from date components", () => {
  assert.strictEqual(String(new LocalDate(1970, 1, 1)), "1970-01-01");
  assert.strictEqual(String(new LocalDate(2001, 2, 3)), "2001-02-03");
});

test("provide date components", () => {
  let date;

  date = new LocalDate(2001, 2, 3);

  assert.strictEqual(date.year, 2001);
  assert.strictEqual(date.month, Month.February);
  assert.strictEqual(date.dayOfMonth, 3);
  assert.strictEqual(date.dayOfWeek, DayOfWeek.Saturday);

  date = new LocalDate(2018, 7, 1);

  assert.strictEqual(date.year, 2018);
  assert.strictEqual(date.month, Month.July);
  assert.strictEqual(date.dayOfMonth, 1);
  assert.strictEqual(date.dayOfWeek, DayOfWeek.Sunday);
});

test("compute date plus and minus days", () => {
  const date = new LocalDate(2001, 2, 3);
  assert.strictEqual(String(date.minusDays(1)), "2001-02-02");
  assert.strictEqual(String(date.minusDays(10)), "2001-01-24");
  assert.strictEqual(String(date.plusDays(1)), "2001-02-04");
  assert.strictEqual(String(date.plusDays(10)), "2001-02-13");
});

test("plusDays generates unique dates", () => {
  const set = new Set();
  let date = new LocalDate(2020, 1, 1);
  for (let i = 0; i <= 366; i++) {
    const value = String(date);
    assert.isFalse(set.has(value), `Duplicate date ${value}`);
    set.add(value);
    date = date.plusDays(1);
  }
});

test("minusDats generates unique dates", () => {
  const set = new Set();
  let date = new LocalDate(2021, 1, 1);
  for (let i = 0; i <= 366; i++) {
    const value = String(date);
    assert.isFalse(set.has(value), `Duplicate date ${value}`);
    set.add(value);
    date = date.minusDays(1);
  }
});

test("compare", () => {
  assert.isTrue(new LocalDate(2001, 1, 2) > new LocalDate(2001, 1, 1));
  assert.isTrue(new LocalDate(2001, 1, 1) < new LocalDate(2001, 1, 2));
});
