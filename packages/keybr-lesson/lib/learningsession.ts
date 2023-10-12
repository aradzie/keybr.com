import { type KeySample } from "@keybr/result";

export function findSession(samples: readonly KeySample[]): KeySample[] {
  const { length } = samples;
  for (let i = length - 1; i > 0; i--) {
    const a = samples[i - 1];
    const b = samples[i];
    if (b.timeStamp - a.timeStamp > /* one hour */ 3600000) {
      return samples.slice(i);
    }
    if (b.filteredTimeToType > a.filteredTimeToType && length - i + 1 >= 5) {
      return samples.slice(i);
    }
  }
  return samples.slice(0);
}
