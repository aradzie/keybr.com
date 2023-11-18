import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { MarkerLayer } from "./MarkerLayer.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.getDefault());

  const testRenderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <MarkerLayer />
    </KeyboardContext.Provider>,
  );

  t.snapshot(testRenderer.toJSON());
});
