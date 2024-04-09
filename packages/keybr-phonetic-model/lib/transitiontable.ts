import { DataError, Reader, Writer } from "@keybr/binary";
import { type Language, Ngram1, Ngram2 } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { Letter } from "./letter.ts";

const signature = Object.freeze([
  0x6b, 0x65, 0x79, 0x62, 0x72, 0x2e, 0x63, 0x6f, 0x6d,
]);

export type Entry = {
  readonly codePoint: CodePoint;
  readonly frequency: number;
};

export type Segment = readonly Entry[];

export class TransitionTable {
  static load(buffer: Uint8Array): TransitionTable {
    const reader = new Reader(buffer);
    readSignature(reader);
    const chain = readChain(reader);
    const segments = readSegments(reader, chain);
    if (reader.remaining() > 0) {
      throw new DataError();
    }
    return new TransitionTable(chain, segments);
  }

  readonly chain: Chain;
  readonly segments: readonly Segment[];

  constructor(chain: Chain, segments: readonly Segment[]) {
    if (segments.length !== chain.segments) {
      throw new Error();
    }
    this.chain = chain;
    this.segments = segments;
  }

  get order(): number {
    return this.chain.order;
  }

  get alphabet(): readonly CodePoint[] {
    return this.chain.alphabet;
  }

  get size(): number {
    return this.chain.size;
  }

  segment(chain: readonly CodePoint[]): Segment {
    return this.segments[this.chain.segmentIndex(chain)];
  }

  compress(): Uint8Array {
    const writer = new Writer();
    writeSignature(writer);
    writeChain(writer, this.chain);
    writeSegments(writer, this.chain, this.segments);
    return writer.buffer();
  }

  letters({ letterName }: Language): Letter[] {
    const map = new Map<CodePoint, number>(
      this.alphabet.map((codePoint) => [codePoint, 0]),
    );
    for (const segment of this.segments) {
      for (const { codePoint, frequency } of segment) {
        map.set(codePoint, (map.get(codePoint) ?? 0) + frequency);
      }
    }
    return [...map.entries()].map(
      ([codePoint, f]) => new Letter(codePoint, f, letterName(codePoint)),
    );
  }

  toNgram1(): Ngram1 {
    const ngram = new Ngram1(this.alphabet);
    for (const segment of this.segments) {
      for (const { codePoint, frequency } of segment) {
        ngram.add(codePoint, frequency);
      }
    }
    return ngram;
  }

  toNgram2(): Ngram2 {
    const ngram = new Ngram2(this.alphabet);
    let index = 0;
    for (const segment of this.segments) {
      const codePoint0 = this.chain.codePoint(index);
      for (const { codePoint, frequency } of segment) {
        ngram.add(codePoint0, codePoint, frequency);
      }
      index += 1;
      if (index === this.chain.size) {
        index = 0;
      }
    }
    return ngram;
  }
}

export class Chain {
  readonly order: number;
  readonly alphabet: readonly CodePoint[];
  readonly size: number;
  readonly segments: number;
  readonly width: number;
  readonly offsets: readonly number[];

  constructor(order: number, alphabet: readonly CodePoint[]) {
    this.order = order;
    this.alphabet = alphabet;
    this.size = this.alphabet.length;
    this.segments = Math.pow(this.size, this.order - 1);
    this.width = Math.pow(this.size, this.order);
    this.offsets = offsets(this.size, this.order);
  }

  segmentIndex(chain: readonly CodePoint[]): number {
    const { order, offsets } = this;
    const { length } = chain;
    let index = 0;
    for (let i = 0; i < order - 1; i++) {
      const codePoint = chain[length - order + i + 1] || 0x0020;
      index += this.index(codePoint) * offsets[i + 1];
    }
    return index;
  }

  entryIndex(chain: readonly CodePoint[]): number {
    const { order, offsets } = this;
    const { length } = chain;
    let index = 0;
    for (let i = 0; i < order; i++) {
      const codePoint = chain[length - order + i] || 0x0020;
      index += this.index(codePoint) * offsets[i];
    }
    return index;
  }

  codePoint(index: number): CodePoint {
    return this.alphabet[index];
  }

  index(codePoint: CodePoint): number {
    return this.alphabet.indexOf(codePoint);
  }
}

function writeSignature(writer: Writer): void {
  for (const c of signature) {
    writer.putUint8(c);
  }
}

function readSignature(reader: Reader): void {
  for (const c of signature) {
    if (reader.getUint8() !== c) {
      throw new DataError();
    }
  }
}

function writeChain(writer: Writer, chain: Chain): void {
  writer.putUint8(chain.order);
  writer.putUint8(chain.size);
  for (let i = 0; i < chain.size; i++) {
    writer.putUint16(chain.alphabet[i]);
  }
}

function readChain(reader: Reader): Chain {
  const order = reader.getUint8();
  const size = reader.getUint8();
  const alphabet = [];
  for (let i = 0; i < size; i++) {
    alphabet.push(reader.getUint16());
  }
  return new Chain(order, alphabet);
}

function writeSegments(
  writer: Writer,
  chain: Chain,
  segments: readonly Segment[],
): void {
  for (let segmentIndex = 0; segmentIndex < chain.segments; segmentIndex++) {
    const segment = segments[segmentIndex];
    writer.putUint8(segment.length);
    for (const { codePoint, frequency } of segment) {
      writer.putUint8(chain.index(codePoint));
      writer.putUint8(frequency);
    }
  }
}

function readSegments(reader: Reader, chain: Chain): Segment[] {
  const segments = [];
  for (let segmentIndex = 0; segmentIndex < chain.segments; segmentIndex++) {
    const segment = [];
    const length = reader.getUint8();
    if (length >= chain.size) {
      throw new DataError();
    }
    for (let entryIndex = 0; entryIndex < length; entryIndex++) {
      const index = reader.getUint8();
      if (index >= chain.size) {
        throw new DataError();
      }
      const frequency = reader.getUint8();
      if (frequency === 0) {
        throw new DataError();
      }
      segment.push({ codePoint: chain.codePoint(index), frequency });
    }
    segments.push(segment);
  }
  return segments;
}

function offsets(size: number, order: number): number[] {
  const offsets = new Array<number>(order);
  for (let i = 0; i < order; i++) {
    offsets[i] = Math.pow(size, order - i - 1);
  }
  return offsets;
}
