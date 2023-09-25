export class AbortedError extends Error {
  override readonly name = "AbortedError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }

  get [Symbol.toStringTag]() {
    return "AbortedError";
  }
}

export class BlockedError extends Error {
  override readonly name = "BlockedError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }

  get [Symbol.toStringTag]() {
    return "BlockedError";
  }
}
