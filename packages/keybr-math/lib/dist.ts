export type Sample = Readonly<{ index: number; pmf: number; cdf: number }>;

/**
 * @see https://en.wikipedia.org/wiki/Empirical_distribution_function
 */
export class Distribution implements Iterable<Sample> {
  readonly #samples: Float64Array;
  readonly #pmf: Float64Array;
  readonly #cdf: Float64Array;

  constructor(samples: readonly number[]) {
    this.#samples = new Float64Array(samples);
    this.#pmf = new Float64Array(this.#samples.length);
    this.#cdf = new Float64Array(this.#samples.length);
    const totalSum = samples.reduce((sum, value) => sum + value, 0);
    let runningSum = 0;
    for (let i = 0; i < this.#samples.length; i++) {
      this.#pmf[i] = samples[i] / totalSum;
      this.#cdf[i] = runningSum += samples[i] / totalSum;
    }
  }

  *[Symbol.iterator](): IterableIterator<Sample> {
    for (let i = 0; i < this.#samples.length; i++) {
      yield { index: i, pmf: this.pmf(i), cdf: this.cdf(i) };
    }
  }

  map<T>(fn: (sample: Sample) => T): T[] {
    return [...this].map((value) => fn(value));
  }

  get length(): number {
    return this.#samples.length;
  }

  pmf(index: number): number {
    const { length } = this.#samples;
    index = Math.round(index);
    if (index < 0) {
      return 0;
    }
    if (index > length - 1) {
      return 0;
    }
    return this.#pmf[index];
  }

  cdf(index: number): number {
    const { length } = this.#samples;
    index = Math.round(index);
    if (index < 0) {
      return 0;
    }
    if (index > length - 1) {
      return 1;
    }
    return this.#cdf[index];
  }

  /** Scales a value in range [0, 1] to a histogram index. */
  scale(index: number): number {
    const { length } = this.#samples;
    index = Math.round(index * (length - 1));
    if (index < 0) {
      return 0;
    }
    if (index > length - 1) {
      return length - 1;
    }
    return index;
  }

  /** Scales a histogram index to a value in range [0, 1]. */
  unscale(index: number): number {
    const { length } = this.#samples;
    index = Math.round(index);
    if (index < 0) {
      return 0;
    }
    if (index > length - 1) {
      return 1;
    }
    return index / (length - 1);
  }
}
