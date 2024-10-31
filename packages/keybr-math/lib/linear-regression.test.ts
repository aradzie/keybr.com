import { test } from "node:test";
import { assert } from "chai";
import { linearRegression } from "./linear-regression.ts";
import { Vector } from "./vector.ts";

test("a", () => {
  const poly = linearRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([0, 0, 0, 0, 0]),
  );

  assert.strictEqual(poly.degree, 0);
  assert.deepStrictEqual(poly.coef, [0]);

  assert.strictEqual(poly.eval(0), 0);
  assert.strictEqual(poly.eval(3), 0);
  assert.strictEqual(poly.eval(6), 0);
});

test("b", () => {
  const poly = linearRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 1, 1, 1, 1]),
  );

  assert.strictEqual(poly.degree, 0);
  assert.deepStrictEqual(poly.coef, [1]);

  assert.strictEqual(poly.eval(0), 1);
  assert.strictEqual(poly.eval(3), 1);
  assert.strictEqual(poly.eval(6), 1);
});

test("c", () => {
  const poly = linearRegression(
    new Vector([0, 1, 2, 3, 4]),
    new Vector([1, 2, 3, 4, 5]),
  );

  assert.strictEqual(poly.degree, 1);
  assert.deepStrictEqual(poly.coef, [1, 1]);

  assert.strictEqual(poly.eval(0), 1);
  assert.strictEqual(poly.eval(3), 4);
  assert.strictEqual(poly.eval(6), 7);
});
