import { test } from "node:test";
import { equal, isFalse, isTrue, throws } from "rich-assert";
import { DayOfWeek, LocalDate, Month } from "./localdate.ts";

test("validate arguments", () => {
  throws(() => {
    new LocalDate(2001, 0, 1);
  });
  throws(() => {
    new LocalDate(2001, 13, 1);
  });
  throws(() => {
    new LocalDate(2001, 1, 0);
  });
  throws(() => {
    new LocalDate(2001, 1, 32);
  });
});

test("create from timestamp", () => {
  equal(String(new LocalDate(new Date(1970, 0, 1, 11, 22, 33))), "1970-01-01");
  equal(String(new LocalDate(new Date(2001, 1, 3, 4, 5, 6))), "2001-02-03");
});

test("create from date components", () => {
  equal(String(new LocalDate(1970, 1, 1)), "1970-01-01");
  equal(String(new LocalDate(2001, 2, 3)), "2001-02-03");
});

test("provide date components", () => {
  let date;

  date = new LocalDate(2001, 2, 3);

  equal(date.year, 2001);
  equal(date.month, Month.February);
  equal(date.dayOfMonth, 3);
  equal(date.dayOfWeek, DayOfWeek.Saturday);

  date = new LocalDate(2018, 7, 1);

  equal(date.year, 2018);
  equal(date.month, Month.July);
  equal(date.dayOfMonth, 1);
  equal(date.dayOfWeek, DayOfWeek.Sunday);
});

test("compute date plus and minus days", () => {
  const date = new LocalDate(2001, 2, 3);
  equal(String(date.minusDays(1)), "2001-02-02");
  equal(String(date.minusDays(10)), "2001-01-24");
  equal(String(date.plusDays(1)), "2001-02-04");
  equal(String(date.plusDays(10)), "2001-02-13");
});

test("plusDays generates unique dates", () => {
  const set = new Set();
  let date = new LocalDate(2020, 1, 1);
  for (let i = 0; i <= 366; i++) {
    const value = String(date);
    isFalse(set.has(value), `Duplicate date ${value}`);
    set.add(value);
    date = date.plusDays(1);
  }
});

test("minusDats generates unique dates", () => {
  const set = new Set();
  let date = new LocalDate(2021, 1, 1);
  for (let i = 0; i <= 366; i++) {
    const value = String(date);
    isFalse(set.has(value), `Duplicate date ${value}`);
    set.add(value);
    date = date.minusDays(1);
  }
});

test("compare", () => {
  isTrue(new LocalDate(2001, 1, 2) > new LocalDate(2001, 1, 1));
  isTrue(new LocalDate(2001, 1, 1) < new LocalDate(2001, 1, 2));
});
