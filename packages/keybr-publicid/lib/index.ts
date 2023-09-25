import { type NamedUser } from "@keybr/pages-shared";

/** Inclusive lower bound of the range of valid internal user ids. */
export const MIN_ID = 0x00000001;
/** Inclusive upper bound of the range of valid internal user ids. */
export const MAX_ID = 0x0fffffff;
/** Regex pattern to match example user ids. */
export const EXAMPLE_ID_PATTERN = new RegExp("^example([1-9])$");

/** Arbitrary offset. */
const OFFSET = 0x05b4c39f;
/** Arbitrary XOR mask. */
const MASK = 0x0a531fcd;
/** Multiplicative inverse of C2 modulo MAX_ID + 1. */
const C1 = 0x0527d98f;
/** Multiplicative inverse of C1 modulo MAX_ID + 1. */
const C2 = 0x00c9256f;
/** Base 36. */
const BASE = 36;
/** Base 36 digits. */
const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
/** Base 36 digits. */
// prettier-ignore
const INVERSE_DIGITS = [
  null, null, null, null, null, null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null, null, 0, 1, 2, 3, 4, 5, 6, 7,
  8, 9, null, null, null, null, null, null, null, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
  null, null, null, null, null, null, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, null, null,
  null, null, null,
];

export class InvalidIdError extends Error {
  constructor() {
    super("invalid id");
  }

  get [Symbol.toStringTag]() {
    return "InvalidIdError";
  }
}

export class PublicId {
  static readonly example1 = PublicId.of("example1");
  static readonly example2 = PublicId.of("example2");
  static readonly example3 = PublicId.of("example3");
  static readonly example4 = PublicId.of("example4");
  static readonly example5 = PublicId.of("example5");
  static readonly examples = [
    PublicId.example1,
    PublicId.example2,
    PublicId.example3,
    PublicId.example4,
    PublicId.example5,
  ];

  static of(publicId: string): PublicId {
    const match = EXAMPLE_ID_PATTERN.exec(publicId);
    if (match != null) {
      return new PublicId(-Number(match[1]));
    } else {
      return new PublicId(fromPublicId(publicId));
    }
  }

  static parse(publicId: string): PublicId | null {
    try {
      return PublicId.of(publicId);
    } catch {
      return null;
    }
  }

  /** Internal user id. */
  readonly id: number;
  /** Public user id. */
  readonly publicId: string;
  /** Whether user id is of an example profile. */
  readonly example: boolean;

  constructor(id: number) {
    if (!Number.isInteger(id) || id === 0) {
      throw new InvalidIdError();
    }
    if (id < 0) {
      this.id = -id;
      this.publicId = `example${-id}`;
      this.example = true;
    } else {
      if (id < MIN_ID || id > MAX_ID) {
        throw new InvalidIdError();
      }
      this.id = id;
      this.publicId = toPublicId(id);
      this.example = false;
    }
  }

  toString(): string {
    return this.publicId;
  }

  toUser(): NamedUser {
    if (!this.example) {
      throw new Error();
    }
    return Object.freeze<NamedUser>({
      id: this.publicId,
      name: `Example User ${this.id}`,
      imageUrl: null,
      premium: false,
    });
  }
}

function toPublicId(id: number): string {
  return formatWithCheckDigit(toPublicInt(id));
}

function fromPublicId(publicId: string): number {
  return fromPublicInt(parseWithCheckDigit(publicId));
}

function toPublicInt(id: number): number {
  id = modMultiply(id, C1);
  id = id ^ MASK;
  id = id & MAX_ID;
  id = id + OFFSET;
  return id;
}

function fromPublicInt(id: number): number {
  id = id - OFFSET;
  id = id ^ MASK;
  id = modMultiply(id, C2);
  id = id & MAX_ID;
  return id;
}

function parseWithCheckDigit(string: string): number {
  let number = 0;
  let checkSum = 0;
  const checkDigit = toDigit(string, 0);
  for (let i = 1; i < string.length; i++) {
    const digit = toDigit(string, i);
    number = number * BASE + digit;
    checkSum += digit * digitWeight(string.length - i);
  }
  if (number === 0 || checkDigit !== checkSum % BASE) {
    throw new InvalidIdError();
  }
  return number;
}

function formatWithCheckDigit(number: number): string {
  let string = "";
  let checkSum = 0;
  do {
    const digit = number % BASE;
    string = DIGITS[digit] + string;
    checkSum += digit * digitWeight(string.length);
  } while ((number = (number / BASE) >>> 0) > 0);
  const checkDigit = checkSum % BASE;
  string = DIGITS[checkDigit] + string;
  return string;
}

/** Multiply modulo 0xFFFFFFFF. */
function modMultiply(a: number, b: number): number {
  a = a >>> 0;
  b = b >>> 0;
  let r = 0;
  for (let n = 0; n < 32; n++) {
    if (((b >>> n) & 1) === 1) {
      r += a << n;
    }
  }
  return r >>> 0;
}

function toDigit(string: string, index: number): number {
  const digit = INVERSE_DIGITS[string.charCodeAt(index)];
  if (digit == null) {
    throw new InvalidIdError();
  }
  return digit;
}

function digitWeight(pos: number): number {
  return (pos & 1) === 0 ? 1 : 3;
}
