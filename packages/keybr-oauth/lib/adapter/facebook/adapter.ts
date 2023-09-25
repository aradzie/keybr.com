import { createHmac } from "node:crypto";
import {
  type Adapter,
  type HttpRequest,
  type HttpResponse,
  type Middleware,
} from "@fastr/client";
import { AbstractAdapter } from "../../adapter.ts";
import { OAuthError } from "../../errors.ts";
import { type ResourceOwner } from "../../resource-owner.ts";
import { type AccessToken } from "../../token.ts";
import { type ClientConfig } from "../../types.ts";
import {
  type FacebookErrorResponse,
  type FacebookProfileResponse,
} from "./types.ts";

const apiVersion = "v17.0";
const authorizationUri = `https://www.facebook.com/${apiVersion}/dialog/oauth`;
const tokenUri = `https://graph.facebook.com/${apiVersion}/oauth/access_token`;
const profileUri = `https://graph.facebook.com/${apiVersion}/me?fields=${[
  "id",
  "email",
  "name",
].join(",")}`;

export class FacebookAdapter extends AbstractAdapter {
  constructor(config: ClientConfig) {
    super(config, { authorizationUri, tokenUri, profileUri });
  }

  override authenticate({ token }: AccessToken): Middleware {
    const proof = createHmac("sha256", this.clientSecret)
      .update(token)
      .digest("hex");
    return async (
      request: HttpRequest,
      adapter: Adapter,
    ): Promise<HttpResponse> => {
      const url = new URL(request.url);
      url.searchParams.set("access_token", token);
      url.searchParams.set("appsecret_proof", proof);
      return adapter({ ...request, url: String(url) });
    };
  }

  override translateError(response: unknown): OAuthError {
    const {
      error: { message, type, code, error_subcode: subcode },
    } = response as FacebookErrorResponse;
    if (type === "OAuthException") {
      if (code === 102) {
        // Name: API Session
        // If no subcode is present, the login status or access token
        // has expired, been revoked, or is otherwise invalid.
        // Get a new access token.
        // If a subcode is present, see the subcode.

        if (subcode === 458) {
          // Name: App Not Installed
          // The User has not logged into your app.
          // Reauthenticate the User.
          return new OAuthError(message, "invalid_client", response);
        }

        if (subcode === 467) {
          // Name: Invalid Access Token
          // Access token has expired, been revoked,
          // or is otherwise invalid.
          return new OAuthError(message, "invalid_request", response);
        }

        return new OAuthError(message, "invalid_request", response);
      }

      if (code === 190) {
        // Name: Access token has expired
        return new OAuthError(message, "invalid_request", response);
      }

      // We don't know how to translate this error exactly.
      return new OAuthError(message, "invalid_request", response);
    }

    throw new TypeError(`Unknown Facebook error: ${JSON.stringify(response)}`);
  }

  protected override parseProfileResponse(
    response: FacebookProfileResponse,
  ): ResourceOwner<FacebookProfileResponse> {
    const { id, email, name } = response;
    return {
      raw: response,
      provider: "facebook",
      id: id,
      email: email || null,
      name: name || null,
      url: `https://www.facebook.com/${id}`,
      imageUrl: `https://graph.facebook.com/${id}/picture`,
    };
  }
}
