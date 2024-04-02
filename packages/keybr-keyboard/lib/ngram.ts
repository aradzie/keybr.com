import { type CodePoint } from "@keybr/unicode";

type Entry1 = {
  readonly a: CodePoint;
  readonly f: number;
};

/**
 * The unigram frequency table.
 */
export class Ngram1 implements Iterable<Entry1> {
  private readonly alphabet: readonly CodePoint[];
  private readonly data: Float64Array;

  constructor(alphabet: readonly CodePoint[]) {
    if (alphabet.length === 0) {
      throw new TypeError();
    }

    this.alphabet = alphabet;
    this.data = new Float64Array(alphabet.length);
  }

  *[Symbol.iterator](): Iterator<Entry1> {
    const { alphabet, data } = this;
    const size = alphabet.length;
    for (let i = 0; i < size; i++) {
      yield {
        a: alphabet[i],
        f: data[i],
      };
    }
  }

  set(a: CodePoint, f: number): void {
    this.data[this.indexOf(a)] = f;
  }

  add(a: CodePoint, f: number): void {
    this.data[this.indexOf(a)] += f;
  }

  get(a: CodePoint): number {
    return this.data[this.indexOf(a)];
  }

  normalize(): void {
    normalize(this.data);
  }

  toJSON() {
    return [...this].map(({ a, f }) => [a, f]);
  }

  private indexOf(codePoint: CodePoint): number {
    const index = this.alphabet.indexOf(codePoint);
    if (index < 0) {
      throw new TypeError();
    }
    return index;
  }
}

type Entry2 = {
  readonly a: CodePoint;
  readonly b: CodePoint;
  readonly f: number;
};

/**
 * The bigram frequency table.
 */
export class Ngram2 implements Iterable<Entry2> {
  private readonly alphabet: readonly CodePoint[];
  private readonly data: Float64Array;

  constructor(alphabet: readonly CodePoint[]) {
    if (alphabet.length === 0) {
      throw new TypeError();
    }
    this.alphabet = alphabet;
    this.data = new Float64Array(alphabet.length * alphabet.length);
  }

  *[Symbol.iterator](): IterableIterator<Entry2> {
    const { alphabet, data } = this;
    const size = alphabet.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        yield {
          a: alphabet[i],
          b: alphabet[j],
          f: data[i * size + j],
        };
      }
    }
  }

  set(a: CodePoint, b: CodePoint, f: number): void {
    const size = this.alphabet.length;
    const i = this.indexOf(a);
    const j = this.indexOf(b);
    this.data[i * size + j] = f;
  }

  add(a: CodePoint, b: CodePoint, f: number): void {
    const size = this.alphabet.length;
    const i = this.indexOf(a);
    const j = this.indexOf(b);
    this.data[i * size + j] += f;
  }

  get(a: CodePoint, b: CodePoint): number {
    const size = this.alphabet.length;
    const i = this.indexOf(a);
    const j = this.indexOf(b);
    return this.data[i * size + j];
  }

  normalize(): void {
    normalize(this.data);
  }

  toJSON() {
    return [...this].map(({ a, b, f }) => [a, b, f]);
  }

  private indexOf(codePoint: CodePoint): number {
    const index = this.alphabet.indexOf(codePoint);
    if (index < 0) {
      throw new TypeError();
    }
    return index;
  }
}

function normalize(data: Float64Array): void {
  const { length } = data;
  const sum = data.reduce((sum, f) => sum + f, 0);
  if (sum > 0) {
    for (let i = 0; i < length; i++) {
      data[i] = data[i] / sum;
    }
  }
}
