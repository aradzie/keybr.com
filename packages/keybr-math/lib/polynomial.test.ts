import { test } from "node:test";
import { assert } from "chai";
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

  assert.strictEqual(poly.degree, 0);
  assert.deepStrictEqual(poly.coef, [1]);
  assert.strictEqual(poly.eval(1), 1);
  assert.strictEqual(poly.eval(2), 1);

  const deriv = poly.derivative();

  assert.strictEqual(deriv.degree, 0);
  assert.deepStrictEqual(deriv.coef, [0]);
});

test("degree 1 (linear)", () => {
  const poly = new Polynomial1(2, 1);

  assert.strictEqual(poly.degree, 1);
  assert.deepStrictEqual(poly.coef, [2, 1]);
  assert.strictEqual(poly.eval(1), 3);
  assert.strictEqual(poly.eval(2), 4);

  const deriv = poly.derivative();

  assert.strictEqual(deriv.degree, 0);
  assert.deepStrictEqual(deriv.coef, [1]);
});

test("degree 2 (quadratic)", () => {
  const poly = new Polynomial2(3, 2, 1);

  assert.strictEqual(poly.degree, 2);
  assert.deepStrictEqual(poly.coef, [3, 2, 1]);
  assert.strictEqual(poly.eval(1), 6);
  assert.strictEqual(poly.eval(2), 11);

  const deriv = poly.derivative();

  assert.strictEqual(deriv.degree, 1);
  assert.deepStrictEqual(deriv.coef, [2, 2]);
});

test("degree 3 (cubic)", () => {
  const poly = new Polynomial3(4, 3, 2, 1);

  assert.strictEqual(poly.degree, 3);
  assert.deepStrictEqual(poly.coef, [4, 3, 2, 1]);
  assert.strictEqual(poly.eval(1), 10);
  assert.strictEqual(poly.eval(2), 26);

  const deriv = poly.derivative();

  assert.strictEqual(deriv.degree, 2);
  assert.deepStrictEqual(deriv.coef, [3, 4, 3]);
});

test("degree N", () => {
  const poly = new PolynomialN([4, 3, 2, 1]);

  assert.strictEqual(poly.degree, 3);
  assert.deepStrictEqual(poly.coef, [4, 3, 2, 1]);
  assert.strictEqual(poly.eval(1), 10);
  assert.strictEqual(poly.eval(2), 26);

  const deriv = poly.derivative();

  assert.strictEqual(deriv.degree, 2);
  assert.deepStrictEqual(deriv.coef, [3, 4, 3]);
});

test("trim zeros", () => {
  assert.deepStrictEqual(Polynomial.from([0]).coef, [0]);
  assert.deepStrictEqual(Polynomial.from([0, 0, 0]).coef, [0]);
  assert.deepStrictEqual(Polynomial.from([3, 2, 1, 0, 0, 0]).coef, [3, 2, 1]);
});
