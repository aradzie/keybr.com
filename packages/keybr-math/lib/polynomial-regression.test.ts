import { test } from "node:test";
import { deepEqual, equal } from "rich-assert";
import { polynomialRegression } from "./polynomial-regression.ts";
import { Vector } from "./vector.ts";

test("a", () => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([0, 0, 0, 0, 0]),
    2,
  );

  equal(poly.degree, 0);
  deepEqual(poly.coef, [0]);

  equal(poly.eval(0), 0);
  equal(poly.eval(3), 0);
  equal(poly.eval(6), 0);
});

test("b", () => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 1, 1, 1, 1]),
    2,
  );

  equal(poly.degree, 0);
  deepEqual(poly.coef, [1]);

  equal(poly.eval(0), 1);
  equal(poly.eval(3), 1);
  equal(poly.eval(6), 1);
});

test("c", () => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 2, 3, 4, 5]),
    2,
  );

  equal(poly.degree, 1);
  deepEqual(poly.coef, [1, 1]);

  equal(poly.eval(0), 1);
  equal(poly.eval(3), 4);
  equal(poly.eval(6), 7);
});

test("d", () => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([3, 6, 11, 18, 27]),
    2,
  );

  equal(poly.degree, 2);
  deepEqual(
    poly.coef,
    [2.999999999999996, 2.00000000000001, 0.9999999999999974], // 3, 2, 1
  );

  equal(poly.eval(0), 2.999999999999996); // 3
  equal(poly.eval(3), 18.000000000000004); // 18
  equal(poly.eval(6), 50.999999999999964); // 51
});
