/**
 * @see https://en.wikipedia.org/wiki/Empirical_distribution_function
 */
export type Distribution = {
  /** Data samples. */
  readonly samples: readonly number[];
  /** Probability mass function. */
  pmf(value: number): number;
  /** Cumulative distribution function. */
  cdf(value: number): number;
};

export function makeDistribution(samples: readonly number[]): Distribution {
  const { length } = samples;
  let tmp = 0;
  const sum = samples.reduce((sum, value) => sum + value, 0);
  const pmf = samples.map((value) => value / sum);
  const cdf = samples.map((value) => (tmp = tmp + value / sum));

  return {
    samples,
    pmf: (index: number): number => {
      index = Math.round(index);
      if (index < 0) {
        return 0;
      }
      if (index >= length) {
        return 0;
      }
      return pmf[index];
    },
    cdf: (index: number): number => {
      index = Math.round(index);
      if (index < 0) {
        return 0;
      }
      if (index >= length) {
        return 1;
      }
      return cdf[index];
    },
  };
}
