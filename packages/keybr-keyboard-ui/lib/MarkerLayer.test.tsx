import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { MarkerLayer } from "./MarkerLayer.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const testRenderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <MarkerLayer />
    </KeyboardContext.Provider>,
  );

  t.snapshot(testRenderer.toJSON());
});
