import { type Layout } from "@keybr/keyboard";
import { type Result } from "@keybr/result";

export type HighScoresRow = {
  readonly user: number;
  readonly layout: Layout;
  readonly timeStamp: Date;
  readonly time: number;
  readonly length: number;
  readonly errors: number;
  readonly complexity: number;
  readonly speed: number;
  readonly score: number;
};

export class HighScores implements Iterable<HighScoresRow> {
  readonly #rows: HighScoresRow[];
  #dirty: boolean;

  constructor(rows: readonly HighScoresRow[]) {
    this.#rows = [...rows];
    this.#dirty = false;
  }

  *[Symbol.iterator](): IterableIterator<HighScoresRow> {
    for (const row of this.#rows) {
      yield row;
    }
  }

  get dirty(): boolean {
    return this.#dirty;
  }

  append(userId: number, results: readonly Result[]): void {
    for (const result of results) {
      if (isValidResult(result)) {
        this.insert({
          user: userId,
          layout: result.layout,
          timeStamp: new Date(result.timeStamp),
          time: result.time,
          length: result.length,
          errors: result.errors,
          complexity: result.complexity,
          speed: result.speed,
          score: result.score,
        });
      }
    }
  }

  insert(
    row: HighScoresRow,
    {
      maxSize = 20, // No more than 20 rows.
      maxAge = 1209600000, // Not older than two weeks.
    }: {
      readonly maxSize?: number;
      readonly maxAge?: number;
    } = {},
  ): number | null {
    if (maxSize < 1) {
      throw new Error();
    }
    if (maxAge < 1) {
      throw new Error();
    }

    const old = new Date(Date.now() - maxAge);

    let position = null;

    if (row.timeStamp >= old) {
      let shouldInsert = true;

      // Remove lower results by the same user.
      for (let i = 0; i < this.#rows.length /**/; ) {
        const x = this.#rows[i];

        // Remove old scores.
        if (x.timeStamp < old) {
          this.#rows.splice(i, 1);
          this.#dirty = true;
          continue;
        }

        // Check scores of the same user.
        if (x.user === row.user) {
          if (x.score > row.score) {
            // There is a higher score by the same user.
            shouldInsert = false;
          } else {
            // Remove lower score by the same user.
            this.#rows.splice(i, 1);
            this.#dirty = true;
            continue;
          }
        }

        // Try to insert.
        if (x.score <= row.score) {
          if (shouldInsert && position == null) {
            // Insert a new row.
            this.#rows.splice((position = i), 0, row);
            this.#dirty = true;
          }
        }

        i += 1;
      }

      // Try to append.
      if (this.#rows.length < maxSize && shouldInsert && position == null) {
        // Append a new row.
        this.#rows.splice((position = this.#rows.length), 0, row);
        this.#dirty = true;
      }

      // Truncate extra results.
      if (this.#rows.length > maxSize) {
        this.#rows.splice(maxSize);
        this.#dirty = true;
      }
    }

    return position;
  }

  toJSON() {
    return [...this.#rows];
  }
}

function isValidResult(result: Result): boolean {
  // Simple validation rule to get rid of trivial lessons.
  // Approve results from lessons that are long and complex enough.
  return result.length >= 50 && result.complexity >= 10;
}
