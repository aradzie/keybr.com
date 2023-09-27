import { type KeySample } from "@keybr/result";

export function findSession(samples: readonly KeySample[]): KeySample[] {
  const { length } = samples;
  let start = length - 1;
  for (let i = length; i > 1; i--) {
    const a = samples[i - 2];
    const b = samples[i - 1];
    if (b.timeStamp - a.timeStamp > /* eight hours */ 28800000) {
      break;
    }
    start = i - 2;
  }
  return samples.slice(start);
}
