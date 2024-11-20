import { test } from "node:test";
import { Language } from "@keybr/keyboard";
import { isNotNull, isTrue } from "rich-assert";
import { Font } from "./font.ts";

test("select fonts for each language", () => {
  for (const language of Language.ALL) {
    const fonts = Font.select(language);
    isTrue(fonts.size > 0);
    for (const font of Font.ALL) {
      isNotNull(Font.find(fonts, font));
    }
  }
});
