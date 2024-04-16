import { type Letter } from "@keybr/phonetic-model";
import { type KeySample, type KeyStats, type KeyStatsMap } from "@keybr/result";
import { type CodePoint } from "@keybr/unicode";
import { type Target } from "./target.ts";

export class LessonKey implements KeyStats {
  static from(keyStats: KeyStats, target: Target): LessonKey {
    const { letter, samples, timeToType, bestTimeToType } = keyStats;
    return new LessonKey({
      letter,
      samples,
      timeToType,
      bestTimeToType,
      confidence: target.confidence(timeToType),
      bestConfidence: target.confidence(bestTimeToType),
    });
  }

  readonly letter: Letter;
  readonly samples: readonly KeySample[];
  readonly timeToType: number | null;
  readonly bestTimeToType: number | null;
  readonly confidence: number | null;
  readonly bestConfidence: number | null;
  readonly isIncluded: boolean;
  readonly isFocused: boolean;
  readonly isForced: boolean;

  constructor({
    letter,
    samples,
    timeToType,
    bestTimeToType,
    confidence,
    bestConfidence,
    isIncluded = false,
    isFocused = false,
    isForced = false,
  }: {
    letter: Letter;
    samples: readonly KeySample[];
    timeToType: number | null;
    bestTimeToType: number | null;
    confidence: number | null;
    bestConfidence: number | null;
    isIncluded?: boolean;
    isFocused?: boolean;
    isForced?: boolean;
  }) {
    this.letter = letter;
    this.samples = samples;
    this.timeToType = timeToType;
    this.bestTimeToType = bestTimeToType;
    this.confidence = confidence;
    this.bestConfidence = bestConfidence;
    this.isIncluded = isIncluded;
    this.isFocused = isFocused;
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
      isFocused: false,
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

  asFocused(): LessonKey {
    return new LessonKey({
      ...this,
      isIncluded: true,
      isFocused: true,
    });
  }
}

export class LessonKeys implements Iterable<LessonKey> {
  static includeAll(keyStatsMap: KeyStatsMap, target: Target): LessonKeys {
    return new LessonKeys(
      [...keyStatsMap].map((keyStats) =>
        LessonKey.from(keyStats, target).asIncluded(),
      ),
    );
  }

  readonly #letters: readonly Letter[];
  readonly #keys: Map<CodePoint, LessonKey>;

  constructor(keys: readonly LessonKey[]) {
    this.#letters = [...keys.map(({ letter }) => letter)];
    this.#keys = new Map(keys.map((key) => [key.letter.codePoint, key]));
  }

  get letters(): readonly Letter[] {
    return this.#letters;
  }

  [Symbol.iterator](): IterableIterator<LessonKey> {
    return this.#keys.values();
  }

  findIncludedKeys(): LessonKey[] {
    return [...this.#keys.values()].filter((key) => key.isIncluded);
  }

  findExcludedKeys(): LessonKey[] {
    return [...this.#keys.values()].filter((key) => !key.isIncluded);
  }

  findFocusedKey(): LessonKey | null {
    return [...this.#keys.values()].find((key) => key.isFocused) ?? null;
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

  focus({ codePoint }: Letter): void {
    this.#keys.set(codePoint, this.#keys.get(codePoint)!.asFocused());
  }

  find(codePoint: CodePoint): LessonKey | null {
    return this.#keys.get(codePoint) ?? null;
  }
}
