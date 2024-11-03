import { test } from "node:test";
import { Language } from "@keybr/keyboard";
import { assert } from "chai";
import { getBlacklist } from "./blacklist.ts";

test("forbid blacklisted words", () => {
  const en = getBlacklist(Language.EN);
  const be = getBlacklist(Language.BE);

  assert.isTrue(en.allow("LOVE"));
  assert.isTrue(en.allow("love"));
  assert.isFalse(en.allow("FUCK"));
  assert.isFalse(en.allow("fuck"));

  assert.isTrue(be.allow("LOVE"));
  assert.isTrue(be.allow("love"));
  assert.isTrue(be.allow("FUCK"));
  assert.isTrue(be.allow("fuck"));
});
