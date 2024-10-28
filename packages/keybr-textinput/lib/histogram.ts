import { type CodePoint } from "@keybr/unicode";
import { type Step } from "./textinput.ts";

export type Sample = {
  readonly codePoint: CodePoint;
  readonly hitCount: number;
  readonly missCount: number;
  readonly timeToType: number;
};

export class Histogram implements Iterable<Sample> {
  static readonly empty = Histogram.from([]);

  readonly #data: Map<CodePoint, Sample>;

  constructor(samples: readonly Sample[]) {
    this.#data = new Map(
      Array.from(samples)
        .sort((a, b) => a.codePoint - b.codePoint)
        .map((sample) => [sample.codePoint, sample]),
    );
  }

  [Symbol.iterator](): IterableIterator<Sample> {
    return this.#data.values();
  }

  get complexity(): number {
    return this.#data.size;
  }

  has(codePoint: CodePoint): boolean {
    return this.#data.has(codePoint);
  }

  get(codePoint: CodePoint): Sample | null {
    return this.#data.get(codePoint) ?? null;
  }

  validate(): boolean {
    if (this.#data.size < 3) {
      return false; // Too few characters.
    }
    for (const sample of this.#data.values()) {
      if (!validateSample(sample)) {
        return false;
      }
    }
    return true;
  }

  static from(steps: readonly Step[]): Histogram {
    const samples = new Map<
      CodePoint,
      {
        hitCount: number;
        missCount: number;
        time: number;
        count: number;
      }
    >();
    for (const { codePoint, timeToType, typo } of steps) {
      let sample = samples.get(codePoint);
      if (sample == null) {
        samples.set(
          codePoint,
          (sample = {
            hitCount: 0,
            missCount: 0,
            time: 0,
            count: 0,
          }),
        );
      }
      sample.hitCount += 1;
      if (typo) {
        sample.missCount += 1;
      } else if (timeToType > 0) {
        sample.time += timeToType;
        sample.count += 1;
      }
    }
    return new Histogram(
      [...samples.entries()]
        .map(([codePoint, { hitCount, missCount, time, count }]) => ({
          codePoint,
          hitCount,
          missCount,
          timeToType: time > 0 && count > 0 ? Math.round(time / count) : 0,
        }))
        .filter(validateSample),
    );
  }
}

export function validateSample({ timeToType }: Sample): boolean {
  if (timeToType > 0) {
    if (timeToType < /* 300WPM/1500CPM */ 40) {
      return false; // Too fast.
    }
    if (timeToType > /* 1WPM/5CPM */ 12000) {
      return false; // Too slow.
    }
  }
  return true;
}
