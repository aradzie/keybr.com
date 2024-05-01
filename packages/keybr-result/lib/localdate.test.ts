import test from "ava";
import { DayOfWeek, LocalDate, Month } from "./localdate.ts";

test("validate arguments", (t) => {
  t.throws(() => {
    new LocalDate(2001, 0, 1);
  });
  t.throws(() => {
    new LocalDate(2001, 13, 1);
  });
  t.throws(() => {
    new LocalDate(2001, 1, 0);
  });
  t.throws(() => {
    new LocalDate(2001, 1, 32);
  });
});

test("create from timestamp", (t) => {
  t.is(String(new LocalDate(new Date(1970, 0, 1, 11, 22, 33))), "1970-01-01");
  t.is(String(new LocalDate(new Date(2001, 1, 3, 4, 5, 6))), "2001-02-03");
});

test("create from date components", (t) => {
  t.is(String(new LocalDate(1970, 1, 1)), "1970-01-01");
  t.is(String(new LocalDate(2001, 2, 3)), "2001-02-03");
});

test("provide date components", (t) => {
  let date;

  date = new LocalDate(2001, 2, 3);

  t.is(date.year, 2001);
  t.is(date.month, Month.February);
  t.is(date.dayOfMonth, 3);
  t.is(date.dayOfWeek, DayOfWeek.Saturday);

  date = new LocalDate(2018, 7, 1);

  t.is(date.year, 2018);
  t.is(date.month, Month.July);
  t.is(date.dayOfMonth, 1);
  t.is(date.dayOfWeek, DayOfWeek.Sunday);
});

test("compute date plus and minus days", (t) => {
  const date = new LocalDate(2001, 2, 3);
  t.is(String(date.minusDays(1)), "2001-02-02");
  t.is(String(date.minusDays(10)), "2001-01-24");
  t.is(String(date.plusDays(1)), "2001-02-04");
  t.is(String(date.plusDays(10)), "2001-02-13");
});

test("plusDays generates unique dates", (t) => {
  const set = new Set();
  let date = new LocalDate(2020, 1, 1);
  for (let i = 0; i <= 366; i++) {
    const value = String(date);
    t.false(set.has(value), `Duplicate date ${value}`);
    set.add(value);
    date = date.plusDays(1);
  }
});

test("minusDats generates unique dates", (t) => {
  const set = new Set();
  let date = new LocalDate(2021, 1, 1);
  for (let i = 0; i <= 366; i++) {
    const value = String(date);
    t.false(set.has(value), `Duplicate date ${value}`);
    set.add(value);
    date = date.minusDays(1);
  }
});

test("compare", (t) => {
  t.true(new LocalDate(2001, 1, 2) > new LocalDate(2001, 1, 1));
  t.true(new LocalDate(2001, 1, 1) < new LocalDate(2001, 1, 2));
});
