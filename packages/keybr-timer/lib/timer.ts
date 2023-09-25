import { makeNow } from "./impl.ts";

/**
 * Timer measures the elapsed time. It should NOT be used as a clock to get the
 * current time.
 */
export class Timer {
  /**
   * Returns a whole number of milliseconds since some arbitrary point in time,
   * monotonically increasing.
   */
  static now = makeNow();

  /**
   * The timestamp when this timer was created.
   */
  readonly started = Timer.now();

  /**
   * Returns a whole number of milliseconds since this timer was created,
   * monotonically increasing.
   */
  elapsed(): number {
    return Math.max(0, Timer.now() - this.started);
  }
}
