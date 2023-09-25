export class InvalidFormatError extends Error {
  override name = "InvalidFormatError";

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }

  get [Symbol.toStringTag]() {
    return "InvalidFormatError";
  }
}
