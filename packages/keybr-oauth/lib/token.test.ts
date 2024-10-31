import { test } from "node:test";
import { assert } from "chai";
import { AccessToken } from "./token.ts";

test("construct token from response", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"] });

  ctx.mock.timers.setTime(Number(new Date("2001-02-03T04:05:06Z")));

  const token = new AccessToken({
    access_token: "token",
    token_type: "bearer",
    expires_in: 3600,
  });

  assert.deepStrictEqual(
    { ...token },
    {
      token: "token",
      type: "bearer",
      expiresAt: new Date("2001-02-03T05:05:06Z"),
    },
  );
  assert.isFalse(token.expired());
});

test("check expired", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"] });

  ctx.mock.timers.setTime(Number(new Date("2001-01-01T00:00:00Z")));

  const token = new AccessToken({
    access_token: "token",
    token_type: "bearer",
    expires_in: 3600,
  });

  assert.isFalse(token.expired());

  ctx.mock.timers.setTime(Number(new Date("2001-01-01T00:58:59Z")));

  assert.isFalse(token.expired());
  assert.isFalse(token.expired(60));
  assert.isFalse(token.expired(0));

  ctx.mock.timers.setTime(Number(new Date("2001-01-01T00:59:00Z")));

  assert.isTrue(token.expired());
  assert.isTrue(token.expired(60));
  assert.isFalse(token.expired(0));

  ctx.mock.timers.setTime(Number(new Date("2001-01-01T01:00:00Z")));

  assert.isTrue(token.expired());
  assert.isTrue(token.expired(0));
});
