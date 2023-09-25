import test from "ava";
import { borderShapes, centerShapes } from "./shapes.ts";
import { Graphics, Path, Transform } from "./svg.ts";

const borderResults: readonly string[] = [
  "M 0 25 L 0 0 L 25 0 Z",
  "M 0 12.5 L 0 0 L 25 0 Z",
  "M 12.5 0 L 25 12.5 L 12.5 25 L 0 12.5 Z",
  "M 2.5 12.5 a 10 10 0 1 1 20 0 a 10 10 0 1 1 -20 0",
];

const centerResults: readonly string[] = [
  "M 0 0 L 25 0 L 25 4 L 14.5 25 L 0 25 Z",
  "M 25 0 L 25 20 L 12.5 20 Z",
  "M 8.3 8.3 L 25 8.3 L 25 25 L 8.3 25 Z",
  "M 6.3 6.3 L 22.5 6.3 L 22.5 22.5 L 6.3 22.5 Z",
  "M 8.8 15 a 6.3 6.3 0 1 1 12.5 0 a 6.3 6.3 0 1 1 -12.5 0",
  "M 0 0 L 25 0 L 25 25 L 0 25 Z M 16.3 22.5 L 22.5 10 L 10 10 Z",
  "M 0 0 L 25 0 L 25 17.5 L 10 10 L 17.5 25 L 0 25 Z",
  "M 25 25 L 12.5 25 L 12.5 12.5 Z",
  "M 0 0 L 25 0 L 25 12.5 L 0 12.5 Z M 0 12.5 L 12.5 12.5 L 12.5 25 L 0 25 Z M 12.5 12.5 L 25 12.5 L 25 25 Z",
  "M 0 0 L 25 0 L 25 25 L 0 25 Z M 8.8 21.5 L 21.5 21.5 L 21.5 8.8 L 8.8 8.8 Z",
  "M 0 0 L 25 0 L 25 25 L 0 25 Z M 9 15.5 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0",
  "M 0 0 L 25 0 L 25 25 L 0 25 Z M 6.3 15.6 L 15.6 25 L 25 15.6 L 15.6 6.3 Z",
];

test(`has ${borderResults.length} border shapes`, (t) => {
  const path0 = new Path();
  const path1 = new Path();
  const transform = new Transform(0, 0, 100, 0);
  borderShapes(new Graphics(path0, transform), 0);
  borderShapes(new Graphics(path1, transform), 4);
  t.is(String(path0), String(path1));
});

for (let i = 0; i < borderResults.length; i++) {
  test(`render border shapes #${i}`, (t) => {
    const path = new Path();
    const transform = new Transform(0, 0, 100, 0);
    borderShapes(new Graphics(path, transform), i);
    t.is(String(path), borderResults[i]);
  });
}

test(`has ${centerResults.length} center shapes`, (t) => {
  const path0 = new Path();
  const path1 = new Path();
  const transform = new Transform(0, 0, 100, 0);
  centerShapes(new Graphics(path0, transform), 0);
  centerShapes(new Graphics(path1, transform), 12);
  t.is(String(path0), String(path1));
});

for (let i = 0; i < centerResults.length; i++) {
  test(`render center shapes #${i}`, (t) => {
    const path = new Path();
    const transform = new Transform(0, 0, 100, 0);
    centerShapes(new Graphics(path, transform), i);
    t.is(String(path), centerResults[i]);
  });
}
