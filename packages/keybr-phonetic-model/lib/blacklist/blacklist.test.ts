import { test } from "node:test";
import { Language } from "@keybr/keyboard";
import { isFalse, isTrue } from "rich-assert";
import { getBlacklist } from "./blacklist.ts";

test("forbid blacklisted words", () => {
  const en = getBlacklist(Language.EN);
  const be = getBlacklist(Language.BE);

  isTrue(en.allow("LOVE"));
  isTrue(en.allow("love"));
  isFalse(en.allow("FUCK"));
  isFalse(en.allow("fuck"));

  isTrue(be.allow("LOVE"));
  isTrue(be.allow("love"));
  isTrue(be.allow("FUCK"));
  isTrue(be.allow("fuck"));
});
