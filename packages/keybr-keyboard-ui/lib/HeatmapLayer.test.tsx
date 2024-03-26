import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { HeatmapLayer } from "./HeatmapLayer.tsx";

test("render empty", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <HeatmapLayer histogram={[]} modifier="f" />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("render with equal counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <HeatmapLayer
        histogram={[
          [{ codePoint: 0x0061 }, 1],
          [{ codePoint: 0x0062 }, 1],
          [{ codePoint: 0x0063 }, 1],
        ]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("render with different counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
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

  t.snapshot(renderer.toJSON());
});
