/**
 * Timer measures the elapsed time. It should NOT be used as a clock to get the
 * current time.
 */
export class Timer {
  static now = () => performance.now();

  /**
   * The timestamp when this timer was created.
   */
  readonly started = Timer.now();

  /**
   * Returns a fractional number of milliseconds since this timer was created,
   * monotonically increasing.
   */
  get elapsed() {
    return Timer.now() - this.started;
  }
}
