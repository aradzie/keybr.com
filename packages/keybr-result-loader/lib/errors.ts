export class DatabaseError extends Error {
  override name = "DatabaseError";

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }

  get [Symbol.toStringTag]() {
    return "DatabaseError";
  }
}
