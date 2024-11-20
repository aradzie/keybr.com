import { test } from "node:test";
import { deepEqual, equal } from "rich-assert";
import {
  Polynomial,
  Polynomial0,
  Polynomial1,
  Polynomial2,
  Polynomial3,
  PolynomialN,
} from "./polynomial.ts";

test("degree 0 (constant)", () => {
  const poly = new Polynomial0(1);

  equal(poly.degree, 0);
  deepEqual(poly.coef, [1]);
  equal(poly.eval(1), 1);
  equal(poly.eval(2), 1);

  const deriv = poly.derivative();

  equal(deriv.degree, 0);
  deepEqual(deriv.coef, [0]);
});

test("degree 1 (linear)", () => {
  const poly = new Polynomial1(2, 1);

  equal(poly.degree, 1);
  deepEqual(poly.coef, [2, 1]);
  equal(poly.eval(1), 3);
  equal(poly.eval(2), 4);

  const deriv = poly.derivative();

  equal(deriv.degree, 0);
  deepEqual(deriv.coef, [1]);
});

test("degree 2 (quadratic)", () => {
  const poly = new Polynomial2(3, 2, 1);

  equal(poly.degree, 2);
  deepEqual(poly.coef, [3, 2, 1]);
  equal(poly.eval(1), 6);
  equal(poly.eval(2), 11);

  const deriv = poly.derivative();

  equal(deriv.degree, 1);
  deepEqual(deriv.coef, [2, 2]);
});

test("degree 3 (cubic)", () => {
  const poly = new Polynomial3(4, 3, 2, 1);

  equal(poly.degree, 3);
  deepEqual(poly.coef, [4, 3, 2, 1]);
  equal(poly.eval(1), 10);
  equal(poly.eval(2), 26);

  const deriv = poly.derivative();

  equal(deriv.degree, 2);
  deepEqual(deriv.coef, [3, 4, 3]);
});

test("degree N", () => {
  const poly = new PolynomialN([4, 3, 2, 1]);

  equal(poly.degree, 3);
  deepEqual(poly.coef, [4, 3, 2, 1]);
  equal(poly.eval(1), 10);
  equal(poly.eval(2), 26);

  const deriv = poly.derivative();

  equal(deriv.degree, 2);
  deepEqual(deriv.coef, [3, 4, 3]);
});

test("trim zeros", () => {
  deepEqual(Polynomial.from([0]).coef, [0]);
  deepEqual(Polynomial.from([0, 0, 0]).coef, [0]);
  deepEqual(Polynomial.from([3, 2, 1, 0, 0, 0]).coef, [3, 2, 1]);
});
