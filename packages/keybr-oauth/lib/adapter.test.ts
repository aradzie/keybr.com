import { FakeResponse, useAdapter } from "@fastr/client";
import test from "ava";
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

test("generate authorization url", (t) => {
  // Act.

  const authorizationUrl = underTest.getAuthorizationUrl({ state: "state1" });

  // Assert.

  t.is(
    authorizationUrl,
    "https://test/authorization/" +
      "?response_type=code" +
      "&client_id=client_id1" +
      "&scope=scope1" +
      "&redirect_uri=redirect_uri1" +
      "&state=state1",
  );
});

test("fetch access token", async (t) => {
  // Arrange.

  useAdapter(
    FakeResponse.of({
      access_token: "access_token0",
      token_type: "bearer",
      expires_in: 3600,
    } satisfies TokenResponse),
  );

  // Act.

  const token = await underTest.getAccessToken({ code: "code" });

  // Assert.

  t.like(token, { token: "access_token0", type: "bearer" });
});

test("handle errors", async (t) => {
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

  const err = (await t.throwsAsync(async () => {
    await underTest.getProfile(accessToken);
  })) as OAuthError;

  // Assert.

  t.true(err instanceof OAuthError);
  t.is(err.message, "omg");
  t.is(err.code, "invalid_request");
  t.deepEqual(err.raw, {
    error: "invalid_request",
    error_description: "omg",
    error_uri: "http://localhost/omg",
  });
});
