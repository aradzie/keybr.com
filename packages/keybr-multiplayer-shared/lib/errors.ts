export class MessageError extends Error {
  override name = "MessageError";

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }

  get [Symbol.toStringTag]() {
    return "MessageError";
  }
}
