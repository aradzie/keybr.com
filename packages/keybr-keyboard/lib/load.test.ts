import { Layout } from "@keybr/layout";
import test from "ava";
import { loadKeyboard } from "./load.ts";

for (const layout of Layout.ALL) {
  test(`load layout ${layout.id}`, (t) => {
    const keyboard = loadKeyboard(layout);
    const codePoints = keyboard.codePoints({
      dead: true,
      shift: true,
      alt: true,
    });

    t.true(codePoints.size > 0);
  });
}
