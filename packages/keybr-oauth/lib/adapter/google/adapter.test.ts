import { FakeResponse, useAdapter } from "@fastr/client";
import test from "ava";
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

test("load user profile", async (t) => {
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

  t.deepEqual(profile, {
    raw,
    provider: "google",
    id: "id0",
    email: "email0",
    name: "name0",
    url: null,
    imageUrl: "picture0",
  } satisfies ResourceOwner<GoogleProfileResponse>);
});

test("load minimal user profile", async (t) => {
  // Arrange.

  const raw: GoogleProfileResponse = {
    sub: "id0",
  };

  useAdapter(FakeResponse.of(raw));

  // Act.

  const profile = await underTest.getProfile(accessToken);

  // Assert.

  t.deepEqual(profile, {
    raw,
    provider: "google",
    id: "id0",
    email: null,
    name: null,
    url: null,
    imageUrl: null,
  } satisfies ResourceOwner<GoogleProfileResponse>);
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
