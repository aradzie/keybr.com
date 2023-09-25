import test from "ava";
import { Sle } from "./sle.ts";

test("solve", (t) => {
  const sle = new Sle(3);

  sle.A[0][0] = 1;
  sle.A[1][1] = 2;
  sle.A[2][2] = 3;
  sle.y[0] = 1;
  sle.y[1] = 2;
  sle.y[2] = 3;

  t.deepEqual(sle.solve(), [1, 1, 1]);
});
