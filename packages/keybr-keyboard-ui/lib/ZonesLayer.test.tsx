import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { ZonesLayer } from "./ZonesLayer.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <ZonesLayer />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});
