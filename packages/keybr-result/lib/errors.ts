export class InvalidResultError extends Error {
  override name = "InvalidResultError";

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }

  get [Symbol.toStringTag]() {
    return "InvalidResultError";
  }
}
