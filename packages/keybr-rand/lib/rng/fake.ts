import { type RNGStream } from "../types.ts";

type Mark = number;

export const FakeRNGStream = (length: number): RNGStream => {
  let index = 0;

  const rng: RNGStream<Mark> = (): number => {
    const r = index / length;
    index += 1;
    if (index === length) {
      index = 0;
    }
    return r;
  };
  rng.mark = (): Mark => {
    return index;
  };
  rng.reset = (mark: Mark): void => {
    index = mark;
  };

  return rng;
};
