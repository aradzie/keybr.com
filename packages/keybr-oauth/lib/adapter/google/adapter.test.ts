import { test } from "node:test";
import { FakeResponse, useAdapter } from "@fastr/client";
import { deepEqual, equal, isInstanceOf } from "rich-assert";
import { OAuthError } from "../../errors.ts";
import { type ResourceOwner } from "../../resource-owner.ts";
import { AccessToken } from "../../token.ts";
import { type ErrorResponse } from "../../types.ts";
import { GoogleAdapter } from "./adapter.ts";
import { type GoogleProfileResponse } from "./types.ts";

const underTest = new GoogleAdapter({
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

  const raw: GoogleProfileResponse = {
    sub: "id0",
    name: "name0",
    given_name: "given_name0",
    family_name: "family_name0",
    picture: "picture0",
    email: "email0",
    email_verified: true,
    locale: "en0",
  };

  useAdapter(FakeResponse.of(raw));

  // Act.

  const profile = await underTest.getProfile(accessToken);

  // Assert.

  deepEqual(profile, {
    raw,
    provider: "google",
    id: "id0",
    email: "email0",
    name: "name0",
    url: null,
    imageUrl: "picture0",
  } satisfies ResourceOwner<GoogleProfileResponse>);
});

test("load minimal user profile", async () => {
  // Arrange.

  const raw: GoogleProfileResponse = {
    sub: "id0",
  };

  useAdapter(FakeResponse.of(raw));

  // Act.

  const profile = await underTest.getProfile(accessToken);

  // Assert.

  deepEqual(profile, {
    raw,
    provider: "google",
    id: "id0",
    email: null,
    name: null,
    url: null,
    imageUrl: null,
  } satisfies ResourceOwner<GoogleProfileResponse>);
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
