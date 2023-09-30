import { newFilter } from "@keybr/math";
import { type Letter } from "@keybr/phonetic-model";
import { type Result } from "./result.ts";
import { type KeySample, type KeyStats, type KeyStatsMap } from "./types.ts";

export function newKeyStatsMap(
  letters: readonly Letter[],
  results: readonly Result[],
): KeyStatsMap {
  const map = new Map<Letter, KeyStats>();
  for (const letter of letters) {
    map.set(letter, makeKeyStats(letter, makeKeySamples(results, letter)));
  }

  return new (class implements KeyStatsMap {
    get letters(): readonly Letter[] {
      return letters;
    }

    get results(): readonly Result[] {
      return results;
    }

    [Symbol.iterator](): IterableIterator<KeyStats> {
      return map.values();
    }

    get(letter: Letter): KeyStats {
      const keyStats = map.get(letter);
      if (keyStats == null) {
        throw new Error();
      } else {
        return keyStats;
      }
    }
  })();
}

function makeKeySamples(
  results: readonly Result[],
  letter: Letter,
): KeySample[] {
  const samples = new Array<KeySample>();
  const filter = newFilter(0.1);
  for (let index = 0; index < results.length; index++) {
    const { timeStamp, histogram } = results[index];
    const sample = histogram.get(letter.codePoint);
    if (sample != null) {
      const { hitCount, missCount, timeToType } = sample;
      if (timeToType > 0) {
        const filteredTimeToType = filter.add(timeToType);
        samples.push({
          index,
          timeStamp,
          hitCount,
          missCount,
          timeToType,
          filteredTimeToType,
        });
      }
    }
  }
  return samples;
}

function makeKeyStats(letter: Letter, samples: readonly KeySample[]): KeyStats {
  let timeToType = NaN;
  let bestTimeToType = NaN;
  for (let i = 0; i < samples.length; i++) {
    const { filteredTimeToType } = samples[i];
    if (i > 0) {
      timeToType = filteredTimeToType;
      bestTimeToType = Math.min(bestTimeToType, timeToType);
    } else {
      timeToType = filteredTimeToType;
      bestTimeToType = timeToType;
    }
  }
  return {
    letter,
    samples,
    timeToType,
    bestTimeToType,
  };
}
