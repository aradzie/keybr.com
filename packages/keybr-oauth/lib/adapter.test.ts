import { test } from "node:test";
import { FakeResponse, useAdapter } from "@fastr/client";
import { deepEqual, equal, isInstanceOf } from "rich-assert";
import { AbstractAdapter } from "./adapter.ts";
import { OAuthError } from "./errors.ts";
import { type ResourceOwner } from "./resource-owner.ts";
import { AccessToken } from "./token.ts";
import {
  type ClientConfig,
  type ErrorResponse,
  type TokenResponse,
} from "./types.ts";

class TestAdapter extends AbstractAdapter {
  constructor(clientConfig: ClientConfig) {
    super(clientConfig, {
      authorizationUri: "https://test/authorization/",
      tokenUri: "https://test/token/",
      profileUri: "https://test/profile/",
    });
  }

  protected parseProfileResponse(): ResourceOwner {
    throw new Error();
  }
}

const underTest = new TestAdapter({
  clientId: "client_id1",
  clientSecret: "client_secret1",
  redirectUri: "redirect_uri1",
  scope: "scope1",
});

const accessToken = new AccessToken({
  access_token: "access_token",
  token_type: "token_type",
  expires_in: 1000,
});

test("generate authorization url", () => {
  // Act.

  const authorizationUrl = underTest.getAuthorizationUrl({ state: "state1" });

  // Assert.

  equal(
    authorizationUrl,
    "https://test/authorization/" +
      "?response_type=code" +
      "&client_id=client_id1" +
      "&scope=scope1" +
      "&redirect_uri=redirect_uri1" +
      "&state=state1",
  );
});

test("fetch access token", async () => {
  // Arrange.

  useAdapter(
    FakeResponse.of({
      access_token: "abc",
      token_type: "bearer",
      expires_in: 3600,
    } satisfies TokenResponse),
  );

  // Act.

  const { token, type } = await underTest.getAccessToken({ code: "code" });

  // Assert.

  equal(token, "abc");
  equal(type, "bearer");
});

test("handle errors", async () => {
  // Arrange.

  useAdapter(
    FakeResponse.of(
      {
        error: "invalid_request",
        error_description: "omg",
        error_uri: "http://localhost/omg",
      } satisfies ErrorResponse,
      {
        status: 400,
      },
    ),
  );

  // Act.

  const err = (await underTest
    .getProfile(accessToken)
    .catch((err) => err)) as OAuthError;

  // Assert.

  isInstanceOf(err, OAuthError);
  equal(err.message, "omg");
  equal(err.code, "invalid_request");
  deepEqual(err.raw, {
    error: "invalid_request",
    error_description: "omg",
    error_uri: "http://localhost/omg",
  });
});
