export class DataError extends Error {
  override name = "DataError";

  constructor(message?: string) {
    super(message);
  }

  get [Symbol.toStringTag]() {
    return "DataError";
  }
}
