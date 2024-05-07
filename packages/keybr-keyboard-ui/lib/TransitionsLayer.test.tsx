import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import test from "ava";
import { TransitionsLayer } from "./TransitionsLayer.tsx";

test.serial("empty", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer histogram={[]} modifier="f" />
    </KeyboardContext.Provider>,
  );

  t.is(r.container.querySelectorAll(".arc.f").length, 0);

  r.unmount();
});

test.serial("equal counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
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

  t.is(r.container.querySelectorAll(".arc.f").length, 2);

  r.unmount();
});

test.serial("different counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
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

  t.is(r.container.querySelectorAll(".arc.f").length, 2);

  r.unmount();
});

test.serial("self arrow", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer
        histogram={[[/* a */ 0x0061, /* a */ 0x0061, 1]]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  t.is(r.container.querySelectorAll(".arc.f").length, 0);

  r.unmount();
});
