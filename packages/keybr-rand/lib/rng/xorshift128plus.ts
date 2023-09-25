import { type RNGStream } from "../types.ts";

type Mark = {
  readonly hi0: number;
  readonly lo0: number;
  readonly hi1: number;
  readonly lo1: number;
};

export const XorShift128Plus = (seed: number): RNGStream => {
  let state0_lo = seed ^ 0x1f9d38af;
  let state0_hi = seed ^ 0xaf410049;
  let state1_lo = seed ^ 0xbd21e214;
  let state1_hi = seed ^ 0xd19d592c;

  let s1_hi = 0;
  let s1_lo = 0;
  let s0_hi = 0;
  let s0_lo = 0;
  let t_hi = 0;
  let t_lo = 0;

  const update = (): void => {
    // s1 = state0;
    s1_hi = state0_hi;
    s1_lo = state0_lo;

    // s0 = state1;
    s0_hi = state1_hi;
    s0_lo = state1_lo;

    // state0 = s0;
    state0_hi = s0_hi;
    state0_lo = s0_lo;

    // s1 ^= s1 << 23;
    t_hi = (s1_hi << 23) | (s1_lo >>> (32 - 23));
    t_lo = s1_lo << 23;
    s1_hi = s1_hi ^ t_hi;
    s1_lo = s1_lo ^ t_lo;

    // s1 ^= s1 >> 17;
    t_hi = s1_hi >>> 17;
    t_lo = (s1_lo >>> 17) | (s1_hi << (32 - 17));
    s1_hi = s1_hi ^ t_hi;
    s1_lo = s1_lo ^ t_lo;

    // s1 ^= s0;
    s1_hi = s1_hi ^ s0_hi;
    s1_lo = s1_lo ^ s0_lo;

    // s1 ^= s0 >> 26;
    t_hi = s0_hi >>> 26;
    t_lo = (s0_lo >>> 26) | (s0_hi << (32 - 26));
    s1_hi = s1_hi ^ t_hi;
    s1_lo = s1_lo ^ t_lo;

    // state1 = s1;
    state1_hi = s1_hi;
    state1_lo = s1_lo;
  };

  /* Generates a random number on [0,1) with 53-bit resolution. */
  const rng: RNGStream<Mark> = (): number => {
    update();
    const a = state0_hi;
    const b = state0_lo;
    return ((a >>> 5) * 0x4000000 + (b >>> 6)) * (1.0 / 0x20000000000000);
  };
  rng.mark = (): Mark => {
    return {
      lo0: state0_lo,
      hi0: state0_hi,
      lo1: state1_lo,
      hi1: state1_hi,
    };
  };
  rng.reset = ({ lo0, hi0, lo1, hi1 }: Mark): void => {
    state0_lo = lo0;
    state0_hi = hi0;
    state1_lo = lo1;
    state1_hi = hi1;
  };

  return rng;
};
