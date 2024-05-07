import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import test from "ava";
import { HeatmapLayer } from "./HeatmapLayer.tsx";

test.serial("empty", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <HeatmapLayer histogram={[]} modifier="f" />
    </KeyboardContext.Provider>,
  );

  t.is(r.container.querySelectorAll(".spot_f").length, 0);

  r.unmount();
});

test.serial("equal counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
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

  t.is(r.container.querySelectorAll(".spot_f").length, 3);

  r.unmount();
});

test.serial("different counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
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

  t.is(r.container.querySelectorAll(".spot_f").length, 3);

  r.unmount();
});

test.serial("combine counts for the same key", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
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

  t.is(r.container.querySelectorAll(".spot_f").length, 2);

  r.unmount();
});
