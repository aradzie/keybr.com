import { test } from "node:test";
import { deepEqual, isFalse, isTrue } from "rich-assert";
import { AccessToken } from "./token.ts";

test("construct token from response", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"] });
  ctx.mock.timers.setTime(Number(new Date("2001-02-03T04:05:06Z")));

  const token = new AccessToken({
    access_token: "token",
    token_type: "bearer",
    expires_in: 3600,
  });

  deepEqual(
    { ...token },
    {
      token: "token",
      type: "bearer",
      expiresAt: new Date("2001-02-03T05:05:06Z"),
    },
  );
  isFalse(token.expired());
});

test("check expired", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"] });
  ctx.mock.timers.setTime(Number(new Date("2001-01-01T00:00:00Z")));

  const token = new AccessToken({
    access_token: "token",
    token_type: "bearer",
    expires_in: 3600,
  });

  isFalse(token.expired());

  ctx.mock.timers.setTime(Number(new Date("2001-01-01T00:58:59Z")));

  isFalse(token.expired());
  isFalse(token.expired(60));
  isFalse(token.expired(0));

  ctx.mock.timers.setTime(Number(new Date("2001-01-01T00:59:00Z")));

  isTrue(token.expired());
  isTrue(token.expired(60));
  isFalse(token.expired(0));

  ctx.mock.timers.setTime(Number(new Date("2001-01-01T01:00:00Z")));

  isTrue(token.expired());
  isTrue(token.expired(0));
});
