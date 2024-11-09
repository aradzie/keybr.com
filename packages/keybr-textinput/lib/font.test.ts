import { test } from "node:test";
import { Language } from "@keybr/keyboard";
import { assert } from "chai";
import { Font } from "./font.ts";

test("select fonts for each language", () => {
  for (const language of Language.ALL) {
    const fonts = Font.select(language);
    assert.isTrue(fonts.size > 0);
    for (const font of Font.ALL) {
      assert.isNotNull(Font.find(fonts, font));
    }
  }
});
