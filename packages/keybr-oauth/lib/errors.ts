import { type ErrorResponse } from "./types.ts";

export class OAuthError<TRaw = unknown> extends Error {
  declare readonly code: string;
  declare readonly raw: TRaw;

  constructor(message: string, code: string, raw: TRaw) {
    super(message);
    Object.defineProperty(this, "name", {
      value: "OAuthError",
    });
    Object.defineProperty(this, "code", {
      value: code,
    });
    Object.defineProperty(this, "raw", {
      value: raw,
    });
  }

  get [Symbol.toStringTag]() {
    return "OAuthError";
  }

  static from(response: ErrorResponse): OAuthError<ErrorResponse> {
    const {
      error: code = "invalid_request",
      error_description: message = "Unknown error",
    } = response;
    return new OAuthError<ErrorResponse>(message, code, response);
  }
}
