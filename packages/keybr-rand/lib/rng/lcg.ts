import { type RNGStream } from "../types.ts";

// See https://en.wikipedia.org/wiki/Linear_congruential_generator

type Mark = {
  readonly x: number;
};

export const LCG = (seed: number): RNGStream => {
  const a = 0x41c64e6d;
  const c = 0x00003039;
  const m = 0x80000000;
  let x = seed ^ 0x3fc28cf6;

  const rng: RNGStream<Mark> = (): number => {
    x = (a * x + c) & (m - 1);
    return x / m;
  };
  rng.mark = (): Mark => {
    return { x };
  };
  rng.reset = (mark: Mark): void => {
    x = mark.x;
  };

  return rng;
};
