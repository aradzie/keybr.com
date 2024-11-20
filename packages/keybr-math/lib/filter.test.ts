import { test } from "node:test";
import { equal } from "rich-assert";
import { makeFilter } from "./filter.ts";

test("filter", () => {
  const filter = makeFilter(0.5);

  equal(filter.n, 0);

  equal(filter.add(1), 1);
  equal(filter.n, 1);

  equal(filter.add(1), 1);
  equal(filter.n, 2);

  equal(filter.add(1), 1);
  equal(filter.n, 3);

  equal(filter.add(5), 3);
  equal(filter.n, 4);

  equal(filter.add(5), 4);
  equal(filter.n, 5);

  equal(filter.add(5), 4.5);
  equal(filter.n, 6);
});
