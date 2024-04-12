import { type CodePoint, toCodePoints } from "@keybr/unicode";
import { Chain, TransitionTable } from "./transitiontable.ts";

type Entry = { codePoint: CodePoint; frequency: number };

type Segment = Entry[];

export class TransitionTableBuilder {
  readonly chain: Chain;
  readonly frequencies: Float64Array;

  constructor(order: number, alphabet: readonly CodePoint[]) {
    this.chain = new Chain(order, alphabet);
    this.frequencies = new Float64Array(this.chain.width);
  }

  set(chain: readonly CodePoint[], frequency: number): void {
    if (!(frequency > 0)) {
      throw new TypeError();
    }
    this.frequencies[this.chain.entryIndex(chain)] = frequency;
  }

  add(chain: readonly CodePoint[], frequency: number): void {
    if (!(frequency > 0)) {
      throw new TypeError();
    }
    this.frequencies[this.chain.entryIndex(chain)] += frequency;
  }

  append(word: string): void {
    const { order, alphabet } = this.chain;
    const chain = new Array(order).fill(0x0020);
    for (const codePoint of toCodePoints(word)) {
      if (codePoint !== 0x0020 && alphabet.includes(codePoint)) {
        if (push(chain, codePoint)) {
          this.add(chain, 1);
        }
      } else {
        if (push(chain, 0x0020)) {
          this.add(chain, 1);
        }
      }
    }
    if (push(chain, 0x0020)) {
      this.add(chain, 1);
    }
  }

  build(): TransitionTable {
    return new TransitionTable(this.chain, this.buildSegments());
  }

  buildSegments(): readonly Segment[] {
    const { chain, frequencies } = this;
    const segments = [];
    for (let segmentIndex = 0; segmentIndex < chain.segments; segmentIndex++) {
      const segment = [];
      for (let entryIndex = 0; entryIndex < chain.size; entryIndex++) {
        const frequency = frequencies[segmentIndex * chain.size + entryIndex];
        if (frequency > 0) {
          segment.push({ codePoint: chain.codePoint(entryIndex), frequency });
        }
      }
      segments.push(this.scaleFrequencies(segment));
    }
    return segments;
  }

  scaleFrequencies(segment: Segment): Segment {
    if (segment.length > 0) {
      const sorted = [...segment].sort((a, b) => b.frequency - a.frequency);
      scaleRough(sorted);
      scaleFine(sorted);
    }
    return segment;
  }
}

function scaleRough(segment: Segment): void {
  const sum = sumFrequencies(segment);
  for (const entry of segment) {
    entry.frequency = Math.max(1, Math.round((255 / sum) * entry.frequency));
  }
}

function scaleFine(segment: Segment): void {
  let sum = sumFrequencies(segment);
  while (sum > 255) {
    let i = 0;
    while (sum > 255 && i < segment.length) {
      const entry = segment[i];
      if (entry.frequency > 1) {
        entry.frequency--;
        sum--;
      }
      i++;
    }
  }
  while (sum < 255) {
    let i = 0;
    while (sum < 255 && i < segment.length) {
      const entry = segment[i];
      entry.frequency++;
      sum++;
      i++;
    }
  }
}

function sumFrequencies(segment: Segment): number {
  let sum = 0;
  for (const entry of segment) {
    sum += entry.frequency;
  }
  return sum;
}

function push(chain: CodePoint[], codePoint: CodePoint): boolean {
  const { length } = chain;
  if (codePoint === 0x0020 && chain[length - 1] === 0x0020) {
    return false;
  }
  for (let i = 0; i < length - 1; i++) {
    chain[i] = chain[i + 1];
  }
  chain[length - 1] = codePoint;
  return true;
}
