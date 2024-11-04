import { test } from "node:test";
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
import { assert } from "chai";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { AdapterFactory } from "./module.ts";

const context = new TestContext();

const kTokenResponse = Symbol();
const kResourceOwner = Symbol();

test.beforeEach(async () => {
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
      return new AccessToken({ ...context.get(kTokenResponse) });
    }

    override async getProfile(): Promise<ResourceOwner> {
      return { ...context.get(kResourceOwner) };
    }

    protected override parseProfileResponse(): ResourceOwner {
      throw new Error("Unreachable");
    }
  }

  context.load(new FakeAuthModule());
  context.bind(kTokenResponse).toValue({
    token_type: "Bearer",
    access_token: "xyz",
    expires_in: 3600,
  } satisfies TokenResponse);
  context.bind(kResourceOwner).toValue({
    raw: {},
    provider: "fake",
    id: "123",
    email: "fake@keybr.com",
    name: "fake",
    url: "url",
    imageUrl: "imageUrl",
  } satisfies ResourceOwner);
});

test("handle unknown provider", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "code"],
    ["state", "state"],
  ]);

  // Act, Assert.

  assert.strictEqual(
    (
      await request //
        .GET("/auth/oauth-init/wtf")
        .send()
    ).status,
    404,
  );
  assert.strictEqual(
    (
      await request //
        .GET("/auth/oauth-callback/wtf?" + params)
        .send()
    ).status,
    404,
  );
});

test("redirect to provider", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request //
    .GET("/auth/oauth-init/fake")
    .send();

  // Assert.

  assert.strictEqual(response.status, 302);

  const url = new URL(response.headers.get("Location")!);

  assert.match(url.searchParams.get("client_id")!, /\S+/);
  assert.match(url.searchParams.get("scope")!, /\S+/);
  assert.match(url.searchParams.get("state")!, /\S+/);
  assert.strictEqual(url.searchParams.get("response_type")!, "code");
  assert.strictEqual(
    url.searchParams.get("redirect_uri")!,
    "https://www.keybr.com/auth/oauth-callback/fake",
  );
});

test("validate state", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "xyz"],
    ["state", "invalid"],
  ]);

  // Act. Step 1: redirect from keybr to provider.

  {
    const response = await request //
      .GET("/auth/oauth-init/fake")
      .send();
    assert.strictEqual(response.status, 302);
  }

  // Assert.

  assert.isNull(await User.findByEmail("fake@keybr.com"));
  assert.isNull(await request.who());

  // Act. Step 2: redirect from provider to keybr.

  {
    const response = await request //
      .GET("/auth/oauth-callback/fake?" + params)
      .send();
    assert.strictEqual(response.status, 400);
  }

  // Assert.

  assert.isNull(await User.findByEmail("fake@keybr.com"));
  assert.isNull(await request.who());
});

test("require email", async () => {
  // Arrange.

  context.bind(kResourceOwner).toValue({
    raw: {},
    provider: "fake",
    id: "123",
    email: null,
    name: "name",
    url: "url",
    imageUrl: "imageUrl",
  } as ResourceOwner);

  const request = startApp(context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "xyz"],
    ["extra", "unknown"],
  ]);

  // Act. Step 1: redirect from keybr to provider.

  {
    const response = await request //
      .GET("/auth/oauth-init/fake")
      .send();
    assert.strictEqual(response.status, 302);
    const url = new URL(response.headers.get("Location")!);
    params.set("state", url.searchParams.get("state")!);
  }

  // Assert.

  assert.isNull(await User.findByEmail("fake@keybr.com"));
  assert.isNull(await request.who());

  // Act. Step 2: redirect from provider to keybr.

  {
    const response = await request //
      .GET("/auth/oauth-callback/fake?" + params)
      .send();
    assert.strictEqual(response.status, 302);
    assert.strictEqual(response.headers.get("Location"), "/account");
  }

  // Assert.

  assert.isNull(await User.findByEmail("fake@keybr.com"));
  assert.isNull(await request.who());
});

test("login a new user", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "xyz"],
    ["extra", "unknown"],
  ]);

  // Act. Step 1: redirect from keybr to provider.

  {
    const response = await request //
      .GET("/auth/oauth-init/fake")
      .send();
    assert.strictEqual(response.status, 302);
    const url = new URL(response.headers.get("Location")!);
    params.set("state", url.searchParams.get("state")!);
  }

  // Assert.

  assert.isNull(await User.findByEmail("fake@keybr.com"));
  assert.isNull(await request.who());

  // Act. Step 2: redirect from provider to keybr.

  {
    const response = await request //
      .GET("/auth/oauth-callback/fake?" + params)
      .send();
    assert.strictEqual(response.status, 302);
    assert.strictEqual(response.headers.get("Location"), "/account");
  }

  // Assert.

  assert.isNotNull(await User.findByEmail("fake@keybr.com"));
  assert.strictEqual(await request.who(), "fake@keybr.com");
});

test("login an existing user", async () => {
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

  const request = startApp(context.get(Application, kMain));

  const params = new URLSearchParams([
    ["code", "xyz"],
    ["extra", "unknown"],
  ]);

  // Act. Step 1: redirect from keybr to provider.

  {
    const response = await request //
      .GET("/auth/oauth-init/fake")
      .send();
    assert.strictEqual(response.status, 302);
    const url = new URL(response.headers.get("Location")!);
    params.set("state", url.searchParams.get("state")!);
  }

  // Assert.

  assert.isNull(await request.who());

  // Act. Step 2: redirect from provider to keybr.

  {
    const response = await request //
      .GET("/auth/oauth-callback/fake?" + params)
      .send();
    assert.strictEqual(response.status, 302);
    assert.strictEqual(response.headers.get("Location"), "/account");
  }

  // Assert.

  assert.strictEqual(await request.who(), "fake@keybr.com");
});
