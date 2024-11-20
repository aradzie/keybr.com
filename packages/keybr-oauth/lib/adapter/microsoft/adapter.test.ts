import { test } from "node:test";
import { FakeResponse, useAdapter } from "@fastr/client";
import { deepEqual, equal, isInstanceOf } from "rich-assert";
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

test("load user profile", async () => {
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

  deepEqual(profile, {
    raw,
    provider: "microsoft",
    id: "id0",
    email: "userPrincipalName0",
    name: "displayName0",
    url: null,
    imageUrl: null,
  } satisfies ResourceOwner<MicrosoftProfileResponse>);
});

test("load minimal user profile", async () => {
  // Arrange.

  const raw: MicrosoftProfileResponse = {
    id: "id0",
  };

  useAdapter(FakeResponse.of(raw));

  // Act.

  const profile = await underTest.getProfile(accessToken);

  // Assert.

  deepEqual(profile, {
    raw,
    provider: "microsoft",
    id: "id0",
    email: null,
    name: null,
    url: null,
    imageUrl: null,
  } satisfies ResourceOwner<MicrosoftProfileResponse>);
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
