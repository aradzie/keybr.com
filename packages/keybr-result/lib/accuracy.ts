import { type Result } from "./result.ts";

export type Streak = {
  readonly level: number;
  readonly results: readonly Result[];
};

export type StreakList = {
  readonly level1: Streak;
  readonly level2: Streak;
  readonly level3: Streak;
} & Iterable<Streak>;

export type AcceptStreak = (streak: Streak) => void;

export class MutableStreakList implements StreakList {
  static readonly level1 = 1.0;
  static readonly level2 = 0.97;
  static readonly level3 = 0.95;

  static findLongest(results: readonly Result[]): Streak[] {
    const candidates = [
      { level: MutableStreakList.level1, results: [] },
      { level: MutableStreakList.level2, results: [] },
      { level: MutableStreakList.level3, results: [] },
    ] as { level: number; results: readonly Result[] }[];
    const accept = (streak: Streak) => {
      for (const candidate of candidates) {
        if (
          streak.level >= candidate.level &&
          streak.results.length >= candidate.results.length
        ) {
          candidate.results = streak.results;
          break;
        }
      }
    };
    const list = new MutableStreakList();
    for (const result of results) {
      list.append(result, accept);
    }
    list.end(accept);
    return candidates.filter((streak) => streak.results.length > 0);
  }

  readonly #top = new TopMutableStreak();
  readonly #level1 = new MutableStreak(MutableStreakList.level1, this.#top);
  readonly #level2 = new MutableStreak(MutableStreakList.level2, this.#level1);
  readonly #level3 = new MutableStreak(MutableStreakList.level3, this.#level2);
  readonly #bottom = new MutableStreak(0, this.#level3);
  readonly #streaks = Object.freeze([this.#level1, this.#level2, this.#level3]);

  get level1(): Streak {
    return this.#level1;
  }

  get level2(): Streak {
    return this.#level2;
  }

  get level3(): Streak {
    return this.#level3;
  }

  [Symbol.iterator](): IterableIterator<Streak> {
    return this.#streaks[Symbol.iterator]();
  }

  append(result: Result, accept: AcceptStreak | null = null) {
    this.#bottom.append(result, accept);
  }

  end(accept: AcceptStreak) {
    this.#bottom.end(accept);
  }

  copy(): StreakList {
    const level1 = this.#level1.copy();
    const level2 = this.#level2.copy();
    const level3 = this.#level3.copy();
    const streaks = [level1, level2, level3];
    return {
      level1,
      level2,
      level3,
      [Symbol.iterator]() {
        return streaks[Symbol.iterator]();
      },
    };
  }
}

class MutableStreak implements Streak {
  readonly #level: number;
  readonly #next: MutableStreak;
  readonly #results: Result[];

  constructor(level: number, next: MutableStreak) {
    this.#level = level;
    this.#next = next;
    this.#results = [];
  }

  get level() {
    return this.#level;
  }

  get results() {
    return this.#results;
  }

  append(result: Result, accept: AcceptStreak | null) {
    const started = this.#results.length > this.#next.#results.length;
    if (this.#next.append(result, accept)) {
      if (started) {
        this.#results.push(result);
      }
      return true;
    }
    if (!started) {
      this.#results.push(...this.#next.#results);
    }
    this.#next.#results.length = 0;
    if (result.accuracy >= this.#level) {
      this.#results.push(result);
      return true;
    }
    if (started && this.#results.length > 0 && accept != null) {
      accept(this.copy());
    }
    return false;
  }

  end(accept: AcceptStreak) {
    if (this.#next != null) {
      this.#next.end(accept);
    }
    if (this.#results.length > 0) {
      accept(this.copy());
    }
  }

  copy(): Streak {
    return {
      level: this.#level,
      results: [...this.#results],
    };
  }
}

class TopMutableStreak extends MutableStreak {
  constructor() {
    super(Infinity, null!);
  }

  override append() {
    return false;
  }
}
