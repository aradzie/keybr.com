import { type Letter } from "@keybr/phonetic-model";
import { type KeySample, type KeyStats, type KeyStatsMap } from "@keybr/result";
import { type CodePoint } from "@keybr/unicode";
import { timeToConfidence } from "./confidence.ts";

export class LessonKey implements KeyStats {
  static from(keyStats: KeyStats): LessonKey {
    const { letter, samples, timeToType, bestTimeToType } = keyStats;
    return new LessonKey({
      letter,
      samples,
      timeToType,
      bestTimeToType,
    });
  }

  static findBoosted(includedKeys: readonly LessonKey[]): LessonKey | null {
    const byConfidence = (a: LessonKey, b: LessonKey): number =>
      (a.confidence ?? 0) - (b.confidence ?? 0) || b.letter.f - a.letter.f;
    const sortedKeys = includedKeys
      .filter((key) => !(key.bestConfidence === 1))
      .sort(byConfidence);
    if (sortedKeys.length > 0) {
      return sortedKeys[0];
    } else {
      return null;
    }
  }

  readonly letter: Letter;
  readonly samples: readonly KeySample[];
  readonly timeToType: number;
  readonly bestTimeToType: number;
  readonly confidence: number | null;
  readonly bestConfidence: number | null;
  readonly isIncluded: boolean;
  readonly isBoosted: boolean;
  readonly isForced: boolean;

  constructor({
    letter,
    samples,
    timeToType,
    bestTimeToType,
    isIncluded = false,
    isBoosted = false,
    isForced = false,
  }: {
    letter: Letter;
    samples: readonly KeySample[];
    timeToType: number;
    bestTimeToType: number;
    isIncluded?: boolean;
    isBoosted?: boolean;
    isForced?: boolean;
  }) {
    this.letter = letter;
    this.samples = samples;
    this.timeToType = timeToType;
    this.bestTimeToType = bestTimeToType;
    this.confidence = timeToConfidence(timeToType);
    this.bestConfidence = timeToConfidence(bestTimeToType);
    this.isIncluded = isIncluded;
    this.isBoosted = isBoosted;
    this.isForced = isForced;
    Object.freeze(this);
  }

  asIncluded(): LessonKey {
    return new LessonKey({
      ...this,
      isIncluded: true,
    });
  }

  asExcluded(): LessonKey {
    return new LessonKey({
      ...this,
      isIncluded: false,
      isBoosted: false,
      isForced: false,
    });
  }

  asForced(): LessonKey {
    return new LessonKey({
      ...this,
      isIncluded: true,
      isForced: true,
    });
  }

  asBoosted(): LessonKey {
    return new LessonKey({
      ...this,
      isIncluded: true,
      isBoosted: true,
    });
  }
}

export class LessonKeys implements Iterable<LessonKey> {
  static includeAll(keyStatsMap: KeyStatsMap): LessonKeys {
    return new LessonKeys(
      [...keyStatsMap].map((keyStats) => LessonKey.from(keyStats).asIncluded()),
    );
  }

  readonly #letters: readonly Letter[];
  readonly #keys: Map<CodePoint, LessonKey>;

  constructor(keys: readonly LessonKey[]) {
    this.#letters = [...keys.map(({ letter }) => letter)];
    this.#keys = new Map(keys.map((key) => [key.letter.codePoint, key]));
  }

  [Symbol.iterator](): IterableIterator<LessonKey> {
    return this.#keys.values();
  }

  get letters(): readonly Letter[] {
    return this.#letters;
  }

  findIncludedKeys(): LessonKey[] {
    return [...this.#keys.values()].filter((key) => key.isIncluded);
  }

  findExcludedKeys(): LessonKey[] {
    return [...this.#keys.values()].filter((key) => !key.isIncluded);
  }

  findBoostedKey(): LessonKey | null {
    return [...this.#keys.values()].find((key) => key.isBoosted) ?? null;
  }

  include({ codePoint }: Letter): void {
    this.#keys.set(codePoint, this.#keys.get(codePoint)!.asIncluded());
  }

  exclude({ codePoint }: Letter): void {
    this.#keys.set(codePoint, this.#keys.get(codePoint)!.asExcluded());
  }

  force({ codePoint }: Letter): void {
    this.#keys.set(codePoint, this.#keys.get(codePoint)!.asForced());
  }

  boost({ codePoint }: Letter): void {
    this.#keys.set(codePoint, this.#keys.get(codePoint)!.asBoosted());
  }

  find(codePoint: CodePoint): LessonKey | null {
    return this.#keys.get(codePoint) ?? null;
  }
}
