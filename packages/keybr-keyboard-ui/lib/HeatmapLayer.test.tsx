import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import { Letter } from "@keybr/phonetic-model";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { HeatmapLayer } from "./HeatmapLayer.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.getDefault(), { full: true });

  const histogram = new Map<Letter, number>();
  histogram.set(new Letter(0x0061, 1), 1);
  histogram.set(new Letter(0x0062, 1), 2);
  histogram.set(new Letter(0x0063, 1), 3);

  const testRenderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <HeatmapLayer histogram={histogram} modifier="f" />
    </KeyboardContext.Provider>,
  );

  t.snapshot(testRenderer.toJSON());
});
