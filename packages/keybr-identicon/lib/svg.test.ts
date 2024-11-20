import { test } from "node:test";
import { equal } from "rich-assert";
import { renderPath } from "./svg.ts";

test("render path from commands", () => {
  equal(renderPath([]), "");
  equal(renderPath([{ type: "Z" }]), "Z");
  equal(
    renderPath([
      { type: "M", x: 1, y: 2 },
      { type: "m", dx: 1, dy: 2 },
      { type: "Z" },
    ]),
    "M 1 2 m 1 2 Z",
  );
  equal(
    renderPath([
      { type: "L", x: 1, y: 2 },
      { type: "l", dx: 1, dy: 2 },
      { type: "Z" },
    ]),
    "L 1 2 l 1 2 Z",
  );
});
