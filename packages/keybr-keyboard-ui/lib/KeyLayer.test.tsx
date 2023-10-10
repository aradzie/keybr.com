import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { KeyLayer } from "./KeyLayer.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.getDefault(), { full: true });

  const testRenderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <KeyLayer />
    </KeyboardContext.Provider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("update", (t) => {
  const keyboard = loadKeyboard(Layout.getDefault(), { full: true });

  const testRenderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <KeyLayer
        depressedKeys={["KeyA", "KeyB", "KeyC"]}
        toggledKeys={["CapsLock", "NumLock"]}
      />
    </KeyboardContext.Provider>,
  );

  t.snapshot(testRenderer.toJSON());
});
