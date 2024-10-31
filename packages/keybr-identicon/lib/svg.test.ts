import { test } from "node:test";
import { assert } from "chai";
import { renderPath } from "./svg.ts";

test("render path from commands", () => {
  assert.strictEqual(renderPath([]), "");
  assert.strictEqual(renderPath([{ type: "Z" }]), "Z");
  assert.strictEqual(
    renderPath([
      { type: "M", x: 1, y: 2 },
      { type: "m", dx: 1, dy: 2 },
      { type: "Z" },
    ]),
    "M 1 2 m 1 2 Z",
  );
  assert.strictEqual(
    renderPath([
      { type: "L", x: 1, y: 2 },
      { type: "l", dx: 1, dy: 2 },
      { type: "Z" },
    ]),
    "L 1 2 l 1 2 Z",
  );
});
