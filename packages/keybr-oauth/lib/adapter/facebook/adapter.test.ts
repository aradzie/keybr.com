import { FakeResponse, useAdapter } from "@fastr/client";
import test from "ava";
import { OAuthError } from "../../errors.ts";
import { type ResourceOwner } from "../../resource-owner.ts";
import { AccessToken } from "../../token.ts";
import { FacebookAdapter } from "./adapter.ts";
import {
  type FacebookErrorResponse,
  type FacebookProfileResponse,
} from "./types.ts";

const underTest = new FacebookAdapter({
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

  const raw: FacebookProfileResponse = {
    id: "id0",
    email: "email0",
    name: "name0",
    first_name: "first_name0",
    last_name: "last_name0",
    picture: {
      data: {
        url: "imageUrl0",
        width: 50,
        height: 50,
        is_silhouette: false,
      },
    },
  };

  useAdapter(FakeResponse.of(raw));

  // Act.

  const profile = await underTest.getProfile(accessToken);

  // Assert.

  t.deepEqual(profile, {
    raw,
    provider: "facebook",
    id: "id0",
    email: "email0",
    name: "name0",
    url: "https://www.facebook.com/id0",
    imageUrl: "https://graph.facebook.com/id0/picture",
  } satisfies ResourceOwner<FacebookProfileResponse>);
});

test("load minimal user profile", async (t) => {
  // Arrange.

  const raw: FacebookProfileResponse = {
    id: "id0",
  };

  useAdapter(FakeResponse.of(raw));

  // Act.

  const profile = await underTest.getProfile(accessToken);

  // Assert.

  t.deepEqual(profile, {
    raw,
    provider: "facebook",
    id: "id0",
    email: null,
    name: null,
    url: "https://www.facebook.com/id0",
    imageUrl: "https://graph.facebook.com/id0/picture",
  } satisfies ResourceOwner<FacebookProfileResponse>);
});

test("handle errors", async (t) => {
  // Arrange.

  useAdapter(
    FakeResponse.of(
      {
        error: {
          message: "omg",
          type: "OAuthException",
          code: 190,
          error_subcode: 100,
        },
      } satisfies FacebookErrorResponse,
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
    error: {
      message: "omg",
      type: "OAuthException",
      code: 190,
      error_subcode: 100,
    },
  });
});
