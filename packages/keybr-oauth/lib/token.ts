import { type TokenResponse } from "./types.ts";

export class AccessToken {
  readonly token: string;
  readonly type: string;
  readonly expiresAt: Date;

  constructor({ access_token, token_type, expires_in }: TokenResponse) {
    this.token = access_token;
    this.type = token_type;
    this.expiresAt = new Date(Date.now() + expires_in * 1000);
  }

  expired(padding = 60): boolean {
    return Date.now() >= this.expiresAt.getTime() - padding * 1000;
  }
}
