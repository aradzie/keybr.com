import test from "ava";
import { polynomialRegression } from "./polynomial-regression.ts";
import { Vector } from "./vector.ts";

test("a", (t) => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([0, 0, 0, 0, 0]),
    2,
  );

  t.is(poly.degree, 0);
  t.deepEqual(poly.coef, [0]);

  t.is(poly.eval(0), 0);
  t.is(poly.eval(3), 0);
  t.is(poly.eval(6), 0);
});

test("b", (t) => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 1, 1, 1, 1]),
    2,
  );

  t.is(poly.degree, 0);
  t.deepEqual(poly.coef, [1]);

  t.is(poly.eval(0), 1);
  t.is(poly.eval(3), 1);
  t.is(poly.eval(6), 1);
});

test("c", (t) => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 2, 3, 4, 5]),
    2,
  );

  t.is(poly.degree, 1);
  t.deepEqual(poly.coef, [1, 1]);

  t.is(poly.eval(0), 1);
  t.is(poly.eval(3), 4);
  t.is(poly.eval(6), 7);
});

test("d", (t) => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([3, 6, 11, 18, 27]),
    2,
  );

  t.is(poly.degree, 2);
  t.deepEqual(
    poly.coef,
    [2.999999999999996, 2.00000000000001, 0.9999999999999974], // 3, 2, 1
  );

  t.is(poly.eval(0), 2.999999999999996); // 3
  t.is(poly.eval(3), 18.000000000000004); // 18
  t.is(poly.eval(6), 50.999999999999964); // 51
});
