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
    index = Math.round(index);
    if (index < 0) {
      return 0;
    }
    if (index >= this.#samples.length) {
      return 0;
    }
    return this.#pmf[index];
  }

  cdf(index: number): number {
    index = Math.round(index);
    if (index < 0) {
      return 0;
    }
    if (index >= this.#samples.length) {
      return 1;
    }
    return this.#cdf[index];
  }
}
