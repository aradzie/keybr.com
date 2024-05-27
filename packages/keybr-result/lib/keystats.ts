import { type Filter, makeFilter } from "@keybr/math";
import { type Letter } from "@keybr/phonetic-model";
import { type Result } from "./result.ts";

export function makeKeyStatsMap(
  letters: readonly Letter[],
  results: readonly Result[],
): KeyStatsMap {
  const map = new MutableKeyStatsMap(letters);
  for (const result of results) {
    map.append(result);
  }
  return map.copy();
}

export type KeyStatsMap<T extends KeyStats = KeyStats> = {
  readonly letters: readonly Letter[];
  readonly results: readonly Result[];
  get(letter: Letter): T;
} & Iterable<T>;

export type KeyStats = {
  readonly letter: Letter;
  readonly samples: readonly KeySample[];
  readonly timeToType: number | null;
  readonly bestTimeToType: number | null;
};

export type KeySample = {
  readonly index: number;
  readonly timeStamp: number;
  readonly hitCount: number;
  readonly missCount: number;
  readonly timeToType: number;
  readonly filteredTimeToType: number;
};

export class MutableKeyStatsMap implements KeyStatsMap<MutableKeyStats> {
  readonly #letters: Letter[];
  readonly #results: Result[];
  readonly #map: Map<Letter, MutableKeyStats>;

  constructor(letters: readonly Letter[]) {
    this.#letters = [...letters];
    this.#results = [];
    this.#map = new Map();
    for (const letter of letters) {
      this.#map.set(letter, new MutableKeyStats(letter));
    }
  }

  get letters(): readonly Letter[] {
    return this.#letters;
  }

  get results(): readonly Result[] {
    return this.#results;
  }

  get(letter: Letter): MutableKeyStats {
    return this.#map.get(letter)!;
  }

  [Symbol.iterator](): IterableIterator<MutableKeyStats> {
    return this.#map.values();
  }

  append(result: Result) {
    this.#results.push(result);
    for (const item of this.#map.values()) {
      item.append(result);
    }
  }

  copy(): KeyStatsMap {
    const letters = [...this.#letters];
    const results = [...this.#results];
    const map = new Map(
      [...this.#map].map(([key, value]) => [key, value.copy()]),
    );
    return {
      get letters(): readonly Letter[] {
        return letters;
      },
      get results(): readonly Result[] {
        return results;
      },
      get(letter): KeyStats {
        return map.get(letter)!;
      },
      [Symbol.iterator](): IterableIterator<KeyStats> {
        return map.values();
      },
    };
  }
}

export class MutableKeyStats implements KeyStats {
  readonly #letter: Letter;
  readonly #samples: KeySample[];
  readonly #filter: Filter;
  #index: number;
  #timeToType: number | null;
  #bestTimeToType: number | null;

  constructor(letter: Letter) {
    this.#letter = letter;
    this.#samples = [];
    this.#filter = makeFilter(0.1);
    this.#index = 0;
    this.#timeToType = null;
    this.#bestTimeToType = null;
  }

  get letter(): Letter {
    return this.#letter;
  }

  get samples(): readonly KeySample[] {
    return this.#samples;
  }

  get timeToType(): number | null {
    return this.#timeToType;
  }

  get bestTimeToType(): number | null {
    return this.#bestTimeToType;
  }

  append(result: Result) {
    const { timeStamp, histogram } = result;
    const sample = histogram.get(this.#letter.codePoint);
    if (sample != null) {
      const { hitCount, missCount, timeToType } = sample;
      if (timeToType > 0) {
        const filteredTimeToType = this.#filter.add(timeToType);
        this.#samples.push({
          index: this.#index,
          timeStamp,
          hitCount,
          missCount,
          timeToType,
          filteredTimeToType,
        });
        this.#timeToType = filteredTimeToType;
        this.#bestTimeToType = Math.min(
          this.#bestTimeToType ?? Infinity,
          filteredTimeToType,
        );
      }
    }
    this.#index += 1;
    return this;
  }

  copy(): KeyStats {
    return {
      letter: this.#letter,
      samples: [...this.#samples],
      timeToType: this.#timeToType,
      bestTimeToType: this.#bestTimeToType,
    };
  }
}
