import test from "ava";
import {
  Polynomial,
  Polynomial0,
  Polynomial1,
  Polynomial2,
  Polynomial3,
  PolynomialN,
} from "./polynomial.ts";

test("degree 0 (constant)", (t) => {
  const poly = new Polynomial0(1);

  t.is(poly.degree, 0);
  t.deepEqual(poly.coef, [1]);
  t.is(poly.eval(1), 1);
  t.is(poly.eval(2), 1);

  const deriv = poly.derivative();

  t.is(deriv.degree, 0);
  t.deepEqual(deriv.coef, [0]);
});

test("degree 1 (linear)", (t) => {
  const poly = new Polynomial1(2, 1);

  t.is(poly.degree, 1);
  t.deepEqual(poly.coef, [2, 1]);
  t.is(poly.eval(1), 3);
  t.is(poly.eval(2), 4);

  const deriv = poly.derivative();

  t.is(deriv.degree, 0);
  t.deepEqual(deriv.coef, [1]);
});

test("degree 2 (quadratic)", (t) => {
  const poly = new Polynomial2(3, 2, 1);

  t.is(poly.degree, 2);
  t.deepEqual(poly.coef, [3, 2, 1]);
  t.is(poly.eval(1), 6);
  t.is(poly.eval(2), 11);

  const deriv = poly.derivative();

  t.is(deriv.degree, 1);
  t.deepEqual(deriv.coef, [2, 2]);
});

test("degree 3 (cubic)", (t) => {
  const poly = new Polynomial3(4, 3, 2, 1);

  t.is(poly.degree, 3);
  t.deepEqual(poly.coef, [4, 3, 2, 1]);
  t.is(poly.eval(1), 10);
  t.is(poly.eval(2), 26);

  const deriv = poly.derivative();

  t.is(deriv.degree, 2);
  t.deepEqual(deriv.coef, [3, 4, 3]);
});

test("degree N", (t) => {
  const poly = new PolynomialN([4, 3, 2, 1]);

  t.is(poly.degree, 3);
  t.deepEqual(poly.coef, [4, 3, 2, 1]);
  t.is(poly.eval(1), 10);
  t.is(poly.eval(2), 26);

  const deriv = poly.derivative();

  t.is(deriv.degree, 2);
  t.deepEqual(deriv.coef, [3, 4, 3]);
});

test("trim zeros", (t) => {
  t.deepEqual(Polynomial.from([0]).coef, [0]);
  t.deepEqual(Polynomial.from([0, 0, 0]).coef, [0]);
  t.deepEqual(Polynomial.from([3, 2, 1, 0, 0, 0]).coef, [3, 2, 1]);
});
