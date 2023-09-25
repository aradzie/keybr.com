import { timeToSpeed } from "@keybr/result";

/**
 * Values equal or below this time-to-type have confidence level of one.
 */
export const MIN_TIME = 340; // 176 cpm, 35 wpm

/**
 * Values equal or above this time-to-type have confidence level of zero.
 */
export const MAX_TIME = 1000; // 60 cpm, 12 wpm

export const SPEED_THRESHOLD = timeToSpeed(MIN_TIME);

/**
 * Return value in range [0, 1] indicating how close typing speed to a critical value.
 * @param t Time-to-type in milliseconds, or <code>NaN</code> if has no samples.
 * @return Confidence level in range [0, 1], or <code>null</code> if not calibrated yet.
 */
export function timeToConfidence(t: number): number | null {
  if (t > 0) {
    t = Math.max(t, MIN_TIME);
    t = Math.min(t, MAX_TIME);
    t = (t - MIN_TIME) / (MAX_TIME - MIN_TIME);
    return 1 - t;
  } else {
    return null;
  }
}
