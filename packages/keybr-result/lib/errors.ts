export class InvalidResultError extends Error {
  override name = "InvalidResultError";

  constructor(message?: string) {
    super(message);
  }

  get [Symbol.toStringTag]() {
    return "InvalidResultError";
  }
}
