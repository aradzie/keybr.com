import { type Letter } from "@keybr/phonetic-model";
import { type KeyStatsMap } from "@keybr/result";
import { Histogram, KeySet } from "./data.ts";

export function keyUsage(keyStatsMap: KeyStatsMap) {
  const { letters } = keyStatsMap;
  const keySet = new KeySet(letters);
  const hit = new Histogram(keySet);
  const miss = new Histogram(keySet);
  for (const letter of letters) {
    const keyStats = keyStatsMap.get(letter);
    for (const sample of keyStats.samples) {
      hit.add(letter, sample.hitCount);
      miss.add(letter, sample.missCount);
    }
  }
  return { keySet, hit, miss };
}

export function hitMissRatio(
  keySet: KeySet<Letter>,
  hit: Histogram<Letter>,
  miss: Histogram<Letter>,
) {
  const ratio = new Histogram(keySet);
  for (const letter of keySet) {
    const hitCount = hit.get(letter);
    const missCount = miss.get(letter);
    if (hitCount > 0 && missCount > 0) {
      ratio.set(letter, missCount / hitCount);
    } else {
      ratio.set(letter, 0);
    }
  }
  return ratio;
}
