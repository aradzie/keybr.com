import { test } from "node:test";
import { assert } from "chai";
import { polynomialRegression } from "./polynomial-regression.ts";
import { Vector } from "./vector.ts";

test("a", () => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([0, 0, 0, 0, 0]),
    2,
  );

  assert.strictEqual(poly.degree, 0);
  assert.deepStrictEqual(poly.coef, [0]);

  assert.strictEqual(poly.eval(0), 0);
  assert.strictEqual(poly.eval(3), 0);
  assert.strictEqual(poly.eval(6), 0);
});

test("b", () => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 1, 1, 1, 1]),
    2,
  );

  assert.strictEqual(poly.degree, 0);
  assert.deepStrictEqual(poly.coef, [1]);

  assert.strictEqual(poly.eval(0), 1);
  assert.strictEqual(poly.eval(3), 1);
  assert.strictEqual(poly.eval(6), 1);
});

test("c", () => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 2, 3, 4, 5]),
    2,
  );

  assert.strictEqual(poly.degree, 1);
  assert.deepStrictEqual(poly.coef, [1, 1]);

  assert.strictEqual(poly.eval(0), 1);
  assert.strictEqual(poly.eval(3), 4);
  assert.strictEqual(poly.eval(6), 7);
});

test("d", () => {
  const poly = polynomialRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([3, 6, 11, 18, 27]),
    2,
  );

  assert.strictEqual(poly.degree, 2);
  assert.deepStrictEqual(
    poly.coef,
    [2.999999999999996, 2.00000000000001, 0.9999999999999974], // 3, 2, 1
  );

  assert.strictEqual(poly.eval(0), 2.999999999999996); // 3
  assert.strictEqual(poly.eval(3), 18.000000000000004); // 18
  assert.strictEqual(poly.eval(6), 50.999999999999964); // 51
});
