import { Application } from "@fastr/core";
import { type Binder, inject, type Module, provides } from "@fastr/invert";
import { User, type UserExternalId } from "@keybr/database";
import {
  AbstractAdapter,
  AccessToken,
  type ClientConfig,
  type ResourceOwner,
  type TokenResponse,
} from "@keybr/oauth";
import { kMain } from "../module.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { AdapterFactory } from "./module.ts";

const kTokenResponse = Symbol();
const kResourceOwner = Symbol();

test.beforeEach(async (t) => {
  class FakeAuthModule implements Module {
    configure({ bind }: Binder): void {}

    @provides({ id: AdapterFactory, name: "fake", singleton: true })
    fake(@inject("canonicalUrl") canonicalUrl: string): AdapterFactory {
      return new (class Fake extends AdapterFactory {
        makeAdapter(redirectUri: string): AbstractAdapter {
          return new FakeAdapter({
            clientId: "clientId",
            clientSecret: "clientSecret",
            scope: "scope",
            redirectUri: String(new URL(redirectUri, canonicalUrl)),
          });
        }
      })();
    }
  }

  class FakeAdapter extends AbstractAdapter {
    constructor(clientConfig: ClientConfig) {
      super(clientConfig, {
        authorizationUri: "https://localhost/authorizationUri",
        tokenUri: "https://localhost/tokenUri",
        profileUri: "https://localhost/profileUri",
      });
    }

    override async getAccessToken(): Promise<AccessToken> {
      return new AccessToken({ ...t.context.get(kTokenResponse) });
    }

    override async getProfile(): Promise<ResourceOwner> {
      return { ...t.context.get(kResourceOwner) };
    }

    protected override parseProfileResponse(): ResourceOwner {
      throw new Error("Unreachable");
    }
  }

  t.context.load(new FakeAuthModule());
  t.context.bind(kTokenResponse).toValue({
    token_type: "Bearer",
    access_token: "xyz",
    expires_in: 3600,
  } satisfies TokenResponse);
  t.context.bind(kResourceOwner).toValue({
    raw: {},
    provider: "fake",
    id: "123",
    email: "fake@keybr.com",
    name: "fake",
    url: "url",
    imageUrl: "imageUrl",
  } satisfies ResourceOwner);
});

test.serial("handle unknown provider", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "code"],
    ["state", "state"],
  ]);

  // Act, Assert.

  t.is(
    (
      await request //
        .GET("/auth/oauth-init/wtf")
        .send()
    ).status,
    404,
  );
  t.is(
    (
      await request //
        .GET("/auth/oauth-callback/wtf?" + params)
        .send()
    ).status,
    404,
  );
});

test.serial("redirect to provider", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request //
    .GET("/auth/oauth-init/fake")
    .send();

  // Assert.

  t.is(response.status, 302);

  const url = new URL(response.headers.get("Location")!);

  t.regex(url.searchParams.get("client_id")!, /\S+/);
  t.regex(url.searchParams.get("scope")!, /\S+/);
  t.regex(url.searchParams.get("state")!, /\S+/);
  t.is(url.searchParams.get("response_type")!, "code");
  t.is(
    url.searchParams.get("redirect_uri")!,
    "https://www.keybr.com/auth/oauth-callback/fake",
  );
});

test.serial("validate state", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "xyz"],
    ["state", "invalid"],
  ]);

  // Act. Step 1: redirect from keybr to provider.

  {
    const response = await request //
      .GET("/auth/oauth-init/fake")
      .send();
    t.is(response.status, 302);
  }

  // Assert.

  t.is(await User.findByEmail("fake@keybr.com"), null);
  t.is(await request.who(), null);

  // Act. Step 2: redirect from provider to keybr.

  {
    const response = await request //
      .GET("/auth/oauth-callback/fake?" + params)
      .send();
    t.is(response.status, 400);
  }

  // Assert.

  t.is(await User.findByEmail("fake@keybr.com"), null);
  t.is(await request.who(), null);
});

test.serial("require email", async (t) => {
  // Arrange.

  t.context.bind(kResourceOwner).toValue({
    raw: {},
    provider: "fake",
    id: "123",
    email: null,
    name: "name",
    url: "url",
    imageUrl: "imageUrl",
  } as ResourceOwner);

  const request = startApp(t.context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "xyz"],
    ["extra", "unknown"],
  ]);

  // Act. Step 1: redirect from keybr to provider.

  {
    const response = await request //
      .GET("/auth/oauth-init/fake")
      .send();
    t.is(response.status, 302);
    const url = new URL(response.headers.get("Location")!);
    params.set("state", url.searchParams.get("state")!);
  }

  // Assert.

  t.is(await User.findByEmail("fake@keybr.com"), null);
  t.is(await request.who(), null);

  // Act. Step 2: redirect from provider to keybr.

  {
    const response = await request //
      .GET("/auth/oauth-callback/fake?" + params)
      .send();
    t.is(response.status, 302);
    t.is(response.headers.get("Location"), "/account");
  }

  // Assert.

  t.is(await User.findByEmail("fake@keybr.com"), null);
  t.is(await request.who(), null);
});

test.serial("login a new user", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "xyz"],
    ["extra", "unknown"],
  ]);

  // Act. Step 1: redirect from keybr to provider.

  {
    const response = await request //
      .GET("/auth/oauth-init/fake")
      .send();
    t.is(response.status, 302);
    const url = new URL(response.headers.get("Location")!);
    params.set("state", url.searchParams.get("state")!);
  }

  // Assert.

  t.is(await User.findByEmail("fake@keybr.com"), null);
  t.is(await request.who(), null);

  // Act. Step 2: redirect from provider to keybr.

  {
    const response = await request //
      .GET("/auth/oauth-callback/fake?" + params)
      .send();
    t.is(response.status, 302);
    t.is(response.headers.get("Location"), "/account");
  }

  // Assert.

  t.not(await User.findByEmail("fake@keybr.com"), null);
  t.is(await request.who(), "fake@keybr.com");
});

test.serial("login an existing user", async (t) => {
  // Arrange.

  await User.query().insertGraph({
    email: "fake@keybr.com",
    name: "fake name",
    externalIds: [
      {
        provider: "fake",
        externalId: "fake id",
        name: "fake name",
        url: "fake url",
        imageUrl: "fake image url",
      } as UserExternalId,
    ],
  } as User);

  const request = startApp(t.context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "xyz"],
    ["extra", "unknown"],
  ]);

  // Act. Step 1: redirect from keybr to provider.

  {
    const response = await request //
      .GET("/auth/oauth-init/fake")
      .send();
    t.is(response.status, 302);
    const url = new URL(response.headers.get("Location")!);
    params.set("state", url.searchParams.get("state")!);
  }

  // Assert.

  t.is(await request.who(), null);

  // Act. Step 2: redirect from provider to keybr.

  {
    const response = await request //
      .GET("/auth/oauth-callback/fake?" + params)
      .send();
    t.is(response.status, 302);
    t.is(response.headers.get("Location"), "/account");
  }

  // Assert.

  t.is(await request.who(), "fake@keybr.com");
});
