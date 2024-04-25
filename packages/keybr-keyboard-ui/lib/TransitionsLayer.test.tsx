import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { TransitionsLayer } from "./TransitionsLayer.tsx";

test("empty", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer histogram={[]} modifier="f" />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("equal counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer
        histogram={[
          [/* a */ 0x0061, /* b */ 0x0062, 1],
          [/* b */ 0x0062, /* c */ 0x0063, 1],
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
      <TransitionsLayer
        histogram={[
          [/* a */ 0x0061, /* b */ 0x0062, 1],
          [/* b */ 0x0062, /* c */ 0x0063, 2],
        ]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("self arrow", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer
        histogram={[[/* a */ 0x0061, /* a */ 0x0061, 1]]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});
