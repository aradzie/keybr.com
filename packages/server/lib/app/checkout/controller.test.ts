import { createHmac } from "node:crypto";
import { test } from "node:test";
import { Application } from "@fastr/core";
import { User } from "@keybr/database";
import { isPremiumUser } from "@keybr/pages-shared";
import { equal, isFalse, isTrue, like } from "rich-assert";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";

const now = new Date("2001-02-03T04:05:06Z");

const context = new TestContext();

test("ignore invalid http method", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Assert.

  equal((await request.GET("/_/checkout").send()).status, 405);
  equal((await request.PUT("/_/checkout").send({})).status, 405);
  equal((await request.DELETE("/_/checkout").send({})).status, 405);
});

test("ignore invalid signature", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });
  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request //
    .POST("/_/checkout")
    .header("Paddle-Signature", "xyz")
    .send(makeEvent(null));

  // Assert.

  equal(response.status, 400);
  equal(response.headers.get("Content-Type"), "text/plain; charset=UTF-8");
  equal(await response.body.text(), "Invalid notification");

  isFalse(isPremiumUser(User.toPublicUser(await User.findById(1), "")));
});

test("ignore invalid user id", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });
  const request = startApp(context.get(Application, kMain));
  const body = makeEvent({ id: "z1qfg4b" });

  // Act.

  const response = await request //
    .POST("/_/checkout")
    .header("Paddle-Signature", signBody(body))
    .send(body);

  // Assert.

  equal(response.status, 500);
  equal(response.headers.get("Content-Type"), "text/plain; charset=UTF-8");
  equal(await response.body.text(), "Error: Unknown user id");

  isFalse(isPremiumUser(User.toPublicUser(await User.findById(1), "")));
});

test("create order", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });
  const request = startApp(context.get(Application, kMain));
  const body = makeEvent({ id: "55vdtk1" });

  // Act.

  const response = await request //
    .POST("/_/checkout")
    .header("Paddle-Signature", signBody(body))
    .send(body);

  // Assert.

  equal(response.status, 200);
  equal(response.headers.get("Content-Type"), "text/plain; charset=UTF-8");
  equal(await response.body.text(), "OK");

  const user = (await User.findById(1))!;
  isTrue(isPremiumUser(User.toPublicUser(user, "")));
  like(user.toJSON(), {
    id: 1,
    order: {
      provider: "paddle",
      id: "txn_123",
      name: null,
      email: null,
      userId: 1,
    },
  });
});

test("re-create order", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  await (await User.findById(1))!.$relatedQuery("order").insert({
    provider: "paddle",
    id: "xyz",
    createdAt: new Date(),
    name: null,
    email: null,
  });

  const request = startApp(context.get(Application, kMain));
  const body = makeEvent({ id: "55vdtk1" });

  // Act.

  const response = await request //
    .POST("/_/checkout")
    .header("Paddle-Signature", signBody(body))
    .send(body);

  // Assert.

  equal(response.status, 200);
  equal(response.headers.get("Content-Type"), "text/plain; charset=UTF-8");
  equal(await response.body.text(), "OK");

  const user = (await User.findById(1))!;
  isTrue(isPremiumUser(User.toPublicUser(user, "")));
  like(user.toJSON(), {
    id: 1,
    order: {
      provider: "paddle",
      id: "txn_123",
      name: null,
      email: null,
      userId: 1,
    },
  });
});

function makeEvent(extra: Record<string, unknown> | null) {
  return {
    event_id: "evt_123",
    notification_id: "ntf_123",
    event_type: "transaction.completed",
    occurred_at: "2001-02-03T04:05:06.000Z",
    data: {
      id: "txn_123",
      status: "completed",
      customData: null,
      items: [],
      payments: [],
      created_at: "2001-02-03T04:05:06.000Z",
      updated_at: "2001-02-03T04:05:06.000Z",
      billed_at: "2001-02-03T04:05:06.000Z",
      custom_data: extra,
    },
  };
}

function signBody(event: Record<string, unknown>) {
  const ts = now.getTime();
  const hmac = createHmac("sha256", "secretKey");
  hmac.update(`${ts}:${JSON.stringify(event)}`);
  const h1 = hmac.digest("hex");
  return `ts=${ts};h1=${h1}`;
}
