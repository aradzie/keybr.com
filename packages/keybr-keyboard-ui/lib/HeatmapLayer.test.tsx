import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { HeatmapLayer } from "./HeatmapLayer.tsx";

test("empty", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <HeatmapLayer histogram={[]} modifier="f" />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("equal counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <HeatmapLayer
        histogram={[
          [/* a */ 0x0061, 1],
          [/* b */ 0x0062, 1],
          [/* c */ 0x0063, 1],
        ]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("different counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <HeatmapLayer
        histogram={[
          [/* a */ 0x0061, 1],
          [/* b */ 0x0062, 2],
          [/* c */ 0x0063, 3],
        ]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("combine counts for the same key", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <HeatmapLayer
        histogram={[
          [/* a */ 0x0061, 1],
          [/* A */ 0x0041, 1],
          [/* b */ 0x0062, 1],
        ]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});
