import {
  type Adapter,
  authenticate,
  expectType,
  handleErrors,
  type HttpRequest,
  type HttpResponse,
  type Middleware,
  request,
} from "@fastr/client";
import { ContentType } from "@fastr/headers";
import { isClientError } from "@fastr/status";
import { OAuthError } from "./errors.ts";
import { type ResourceOwner } from "./resource-owner.ts";
import { AccessToken } from "./token.ts";
import {
  type AdapterConfig,
  type ClientConfig,
  type ErrorResponse,
} from "./types.ts";

export abstract class AbstractAdapter {
  protected readonly clientId: string;
  protected readonly clientSecret: string;
  protected readonly scope: string;
  protected readonly redirectUri: string;
  protected readonly authorizationUri: string;
  protected readonly tokenUri: string;
  protected readonly profileUri: string;

  protected constructor(
    { clientId, clientSecret, scope, redirectUri }: ClientConfig,
    { authorizationUri, tokenUri, profileUri }: AdapterConfig,
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope = scope;
    this.redirectUri = redirectUri;
    this.authorizationUri = authorizationUri;
    this.tokenUri = tokenUri;
    this.profileUri = profileUri;
  }

  getAuthorizationUrl({ state }: { state: string }): string {
    const url = new URL(this.authorizationUri);
    for (const [key, value] of Object.entries({
      response_type: "code",
      client_id: this.clientId,
      scope: this.scope,
      redirect_uri: this.redirectUri,
      state,
    })) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
    return String(url);
  }

  async getAccessToken({ code }: { code: string }): Promise<AccessToken> {
    const response = await request
      .use(this.handleErrors())
      .use(handleErrors())
      .use(expectType("application/json"))
      .POST(this.tokenUri)
      .send(
        new URLSearchParams([
          ["grant_type", "authorization_code"],
          ["client_id", this.clientId],
          ["client_secret", this.clientSecret],
          ["redirect_uri", this.redirectUri],
          ["code", code],
        ]),
      );
    return new AccessToken(await response.body.json());
  }

  authenticate({ type, token }: AccessToken): Middleware {
    return authenticate(`${type} ${token}`);
  }

  handleErrors(): Middleware {
    return async (
      request: HttpRequest,
      adapter: Adapter,
    ): Promise<HttpResponse> => {
      const response = await adapter(request);
      if (
        isClientError(response.status) &&
        ContentType.get(response.headers)?.type.essence === "application/json"
      ) {
        throw this.translateError(await response.body.json());
      }
      return response;
    };
  }

  translateError(response: unknown): OAuthError {
    return OAuthError.from(response as ErrorResponse);
  }

  async getProfile(accessToken: AccessToken): Promise<ResourceOwner> {
    const response = await request
      .use(this.handleErrors())
      .use(handleErrors())
      .use(expectType("application/json"))
      .use(this.authenticate(accessToken))
      .GET(this.profileUri)
      .send();
    return this.parseProfileResponse(await response.body.json());
  }

  protected abstract parseProfileResponse(response: unknown): ResourceOwner;
}
