export type RNG = {
  /** Generates next pseudo-random number in range 0 <= value < 1. */
  (): number;
};

export type RNGStream<MarkT = unknown> = RNG & {
  /** Remembers position within the stream of random numbers. */
  mark(): MarkT;
  /** Goes to the remembered position within the stream of random numbers. */
  reset(mark: MarkT): void;
};
