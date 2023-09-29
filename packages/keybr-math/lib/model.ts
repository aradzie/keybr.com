import { type Vector } from "./vector.ts";

export type Model = {
  eval(x: number): number;
};

export function constModel(v: number): Model {
  return new (class Const implements Model {
    eval(x: number): number {
      return v;
    }
  })();
}

/**
 * @see https://en.wikipedia.org/wiki/Coefficient_of_determination
 */
export function r2(vx: Vector, vy: Vector, model: Model): number {
  const { length } = vx;
  if (length !== vy.length) {
    throw new Error();
  }
  if (length === 0) {
    throw new Error();
  }

  let sy = 0;
  for (let i = 0; i < length; i++) {
    sy = sy + vy.at(i);
  }
  const my = sy / length;
  let ssres = 0;
  let sstot = 0;
  for (let i = 0; i < length; i++) {
    const t0 = vy.at(i) - model.eval(vx.at(i));
    const t1 = vy.at(i) - my;
    ssres = ssres + t0 * t0;
    sstot = sstot + t1 * t1;
  }
  return 1 - ssres / sstot;
}
