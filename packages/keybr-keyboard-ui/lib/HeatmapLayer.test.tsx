import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { HeatmapLayer } from "./HeatmapLayer.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.getDefault(), { full: true });

  const testRenderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <HeatmapLayer
        histogram={[
          [{ codePoint: 0x0061 }, 1],
          [{ codePoint: 0x0062 }, 2],
          [{ codePoint: 0x0063 }, 3],
        ]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  t.snapshot(testRenderer.toJSON());
});
