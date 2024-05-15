import test from "ava";
import { makeFilter } from "./filter.ts";

test("filter", (t) => {
  const filter = makeFilter(0.5);

  t.is(filter.n, 0);

  t.is(filter.add(1), 1);
  t.is(filter.n, 1);

  t.is(filter.add(1), 1);
  t.is(filter.n, 2);

  t.is(filter.add(1), 1);
  t.is(filter.n, 3);

  t.is(filter.add(5), 3);
  t.is(filter.n, 4);

  t.is(filter.add(5), 4);
  t.is(filter.n, 5);

  t.is(filter.add(5), 4.5);
  t.is(filter.n, 6);
});
