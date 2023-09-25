import test from "ava";
import { renderPath } from "./svg.ts";

test("render path from commands", (t) => {
  t.is(renderPath([]), "");
  t.is(renderPath([{ type: "Z" }]), "Z");
  t.is(
    renderPath([
      { type: "M", x: 1, y: 2 },
      { type: "m", dx: 1, dy: 2 },
      { type: "Z" },
    ]),
    "M 1 2 m 1 2 Z",
  );
  t.is(
    renderPath([
      { type: "L", x: 1, y: 2 },
      { type: "l", dx: 1, dy: 2 },
      { type: "Z" },
    ]),
    "L 1 2 l 1 2 Z",
  );
});
