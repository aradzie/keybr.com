export class DataError extends Error {
  override name = "DataError";

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }

  get [Symbol.toStringTag]() {
    return "DataError";
  }
}
