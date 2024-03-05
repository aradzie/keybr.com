import { Language } from "@keybr/keyboard";
import test from "ava";
import { getBlacklist } from "./blacklist.ts";

test("forbid blacklisted words", (t) => {
  const en = getBlacklist(Language.EN);
  const be = getBlacklist(Language.BE);

  t.true(en.allow("LOVE"));
  t.true(en.allow("love"));
  t.false(en.allow("FUCK"));
  t.false(en.allow("fuck"));

  t.true(be.allow("LOVE"));
  t.true(be.allow("love"));
  t.true(be.allow("FUCK"));
  t.true(be.allow("fuck"));
});
