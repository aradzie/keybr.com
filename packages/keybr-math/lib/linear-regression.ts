import { Polynomial } from "./polynomial.ts";
import { type Vector } from "./vector.ts";

export function linearRegression(vx: Vector, vy: Vector): Polynomial {
  const { length } = vx;
  if (length !== vy.length) {
    throw new Error();
  }
  if (length === 0) {
    throw new Error();
  }

  let sx = 0;
  let sy = 0;
  for (let i = 0; i < length; i++) {
    sx = sx + vx.at(i);
    sy = sy + vy.at(i);
  }
  const mx = sx / length;
  const my = sy / length;

  let s1 = 0;
  let s2 = 0;
  for (let i = 0; i < length; i++) {
    const t0 = vx.at(i) - mx;
    const t1 = vy.at(i) - my;
    s1 = s1 + t0 * t1;
    s2 = s2 + t0 * t0;
  }
  const a = my - (s1 / s2) * mx;
  const b = s1 / s2;

  return Polynomial.from([a, b]);
}
