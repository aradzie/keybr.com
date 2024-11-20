import { test } from "node:test";
import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { equal } from "rich-assert";
import { TransitionsLayer } from "./TransitionsLayer.tsx";

test("empty", () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer histogram={[]} modifier="f" />
    </KeyboardContext.Provider>,
  );

  equal(r.container.querySelectorAll(".arc.f").length, 0);

  r.unmount();
});

test("equal counts", () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer
        histogram={[
          [/* "a" */ 0x0061, /* "b" */ 0x0062, 1],
          [/* "b" */ 0x0062, /* "c" */ 0x0063, 1],
        ]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  equal(r.container.querySelectorAll(".arc.f").length, 2);

  r.unmount();
});

test("different counts", () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer
        histogram={[
          [/* "a" */ 0x0061, /* "b" */ 0x0062, 1],
          [/* "b" */ 0x0062, /* "c" */ 0x0063, 2],
        ]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  equal(r.container.querySelectorAll(".arc.f").length, 2);

  r.unmount();
});

test("self arrow", () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer
        histogram={[[/* "a" */ 0x0061, /* "a" */ 0x0061, 1]]}
        modifier="f"
      />
    </KeyboardContext.Provider>,
  );

  equal(r.container.querySelectorAll(".arc.f").length, 0);

  r.unmount();
});
