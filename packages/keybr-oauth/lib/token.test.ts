import test from "ava";
import MockDate from "mockdate";
import { AccessToken } from "./token.ts";

test.beforeEach(() => {
  MockDate.reset();
});

test.afterEach(() => {
  MockDate.reset();
});

test("construct token from response", (t) => {
  MockDate.set(new Date("2001-02-03T04:05:06Z"));

  const token = new AccessToken({
    access_token: "token",
    token_type: "bearer",
    expires_in: 3600,
  });

  t.deepEqual(
    { ...token },
    {
      token: "token",
      type: "bearer",
      expiresAt: new Date("2001-02-03T05:05:06Z"),
    },
  );
  t.false(token.expired());
});

test("check expired", (t) => {
  MockDate.set(new Date("2001-01-01T00:00:00Z"));

  const token = new AccessToken({
    access_token: "token",
    token_type: "bearer",
    expires_in: 3600,
  });

  t.false(token.expired());

  MockDate.set(new Date("2001-01-01T00:58:59Z"));

  t.false(token.expired());
  t.false(token.expired(60));
  t.false(token.expired(0));

  MockDate.set(new Date("2001-01-01T00:59:00Z"));

  t.true(token.expired());
  t.true(token.expired(60));
  t.false(token.expired(0));

  MockDate.set(new Date("2001-01-01T01:00:00Z"));

  t.true(token.expired());
  t.true(token.expired(0));
});
