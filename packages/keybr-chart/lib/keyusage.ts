import { Histogram, KeySet } from "@keybr/math";
import { type KeyStatsMap } from "@keybr/result";

export function keyUsage(keyStatsMap: KeyStatsMap) {
  const { letters } = keyStatsMap;
  const keySet = new KeySet(letters);
  const hit = new Histogram(keySet);
  const miss = new Histogram(keySet);
  const ratio = new Histogram(keySet);
  for (const letter of letters) {
    const keyStats = keyStatsMap.get(letter);
    for (const { hitCount, missCount } of keyStats.samples) {
      hit.add(letter, hitCount);
      miss.add(letter, missCount);
    }
  }
  for (const letter of letters) {
    const hitCount = hit.get(letter);
    const missCount = miss.get(letter);
    if (hitCount > 0 && missCount > 0) {
      ratio.set(letter, missCount / hitCount);
    }
  }
  return { keySet, hit, miss, ratio };
}
