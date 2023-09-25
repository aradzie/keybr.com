import { FakeResponse, useAdapter } from "@fastr/client";
import test from "ava";
import { OAuthError } from "../../errors.ts";
import { type ResourceOwner } from "../../resource-owner.ts";
import { AccessToken } from "../../token.ts";
import { type ErrorResponse } from "../../types.ts";
import { MicrosoftAdapter } from "./adapter.ts";
import { type MicrosoftProfileResponse } from "./types.ts";

const underTest = new MicrosoftAdapter({
  clientId: "client_id",
  clientSecret: "client_secret",
  redirectUri: "redirect_uri",
  scope: "scope",
});

const accessToken = new AccessToken({
  access_token: "access_token",
  token_type: "token_type",
  expires_in: 1000,
});

test("load user profile", async (t) => {
  // Arrange.

  const raw: MicrosoftProfileResponse = {
    id: "id0",
    displayName: "displayName0",
    surname: "surname0",
    givenName: "givenName0",
    userPrincipalName: "userPrincipalName0",
  };

  useAdapter(FakeResponse.of(raw));

  // Act.

  const profile = await underTest.getProfile(accessToken);

  // Assert.

  t.deepEqual(profile, {
    raw,
    provider: "microsoft",
    id: "id0",
    email: "userPrincipalName0",
    name: "displayName0",
    url: null,
    imageUrl: null,
  } satisfies ResourceOwner<MicrosoftProfileResponse>);
});

test("load minimal user profile", async (t) => {
  // Arrange.

  const raw: MicrosoftProfileResponse = {
    id: "id0",
  };

  useAdapter(FakeResponse.of(raw));

  // Act.

  const profile = await underTest.getProfile(accessToken);

  // Assert.

  t.deepEqual(profile, {
    raw,
    provider: "microsoft",
    id: "id0",
    email: null,
    name: null,
    url: null,
    imageUrl: null,
  } satisfies ResourceOwner<MicrosoftProfileResponse>);
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
