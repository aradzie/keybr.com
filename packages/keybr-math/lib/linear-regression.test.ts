import test from "ava";
import { linearRegression } from "./linear-regression.ts";
import { Vector } from "./vector.ts";

test("a", (t) => {
  const poly = linearRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([0, 0, 0, 0, 0]),
  );

  t.is(poly.degree, 0);
  t.deepEqual(poly.coef, [0]);

  t.is(poly.eval(0), 0);
  t.is(poly.eval(3), 0);
  t.is(poly.eval(6), 0);
});

test("b", (t) => {
  const poly = linearRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 1, 1, 1, 1]),
  );

  t.is(poly.degree, 0);
  t.deepEqual(poly.coef, [1]);

  t.is(poly.eval(0), 1);
  t.is(poly.eval(3), 1);
  t.is(poly.eval(6), 1);
});

test("c", (t) => {
  const poly = linearRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 2, 3, 4, 5]),
  );

  t.is(poly.degree, 1);
  t.deepEqual(poly.coef, [1, 1]);

  t.is(poly.eval(0), 1);
  t.is(poly.eval(3), 4);
  t.is(poly.eval(6), 7);
});
