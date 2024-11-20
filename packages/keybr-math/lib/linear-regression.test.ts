import { test } from "node:test";
import { deepEqual, equal } from "rich-assert";
import { linearRegression } from "./linear-regression.ts";
import { Vector } from "./vector.ts";

test("a", () => {
  const poly = linearRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([0, 0, 0, 0, 0]),
  );

  equal(poly.degree, 0);
  deepEqual(poly.coef, [0]);

  equal(poly.eval(0), 0);
  equal(poly.eval(3), 0);
  equal(poly.eval(6), 0);
});

test("b", () => {
  const poly = linearRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 1, 1, 1, 1]),
  );

  equal(poly.degree, 0);
  deepEqual(poly.coef, [1]);

  equal(poly.eval(0), 1);
  equal(poly.eval(3), 1);
  equal(poly.eval(6), 1);
});

test("c", () => {
  const poly = linearRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 2, 3, 4, 5]),
  );

  equal(poly.degree, 1);
  deepEqual(poly.coef, [1, 1]);

  equal(poly.eval(0), 1);
  equal(poly.eval(3), 4);
  equal(poly.eval(6), 7);
});
