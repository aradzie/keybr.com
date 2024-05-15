/**
 * @see https://en.wikipedia.org/wiki/Exponential_smoothing
 */
export type Filter = {
  /** Number of samples added so far. */
  readonly n: number;
  /** Adds a new sample. */
  add(v: number): number;
};

export const makeFilter = (alpha: number): Filter => {
  let n = 0;
  let value = NaN;

  return {
    get n(): number {
      return n;
    },
    add: (v: number): number => {
      n++;
      if (n > 1) {
        value = alpha * v + (1 - alpha) * value;
      } else {
        value = v;
      }
      return value;
    },
  };
};
