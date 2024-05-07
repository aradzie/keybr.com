import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import test from "ava";
import { KeyLayer } from "./KeyLayer.tsx";

test.serial("render", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <KeyLayer />
    </KeyboardContext.Provider>,
  );

  t.is(r.container.querySelectorAll(".key").length, 58);
  t.is(r.container.querySelectorAll(".depressedKey").length, 0);
  t.is(r.container.querySelectorAll(".symbol").length, 78);

  r.unmount();
});

test.serial("update", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <KeyLayer
        depressedKeys={["KeyA", "KeyB", "KeyC"]}
        toggledKeys={["CapsLock", "NumLock"]}
      />
    </KeyboardContext.Provider>,
  );

  t.is(r.container.querySelectorAll(".key").length, 58);
  t.is(r.container.querySelectorAll(".depressedKey").length, 3);
  t.is(r.container.querySelectorAll(".symbol").length, 78);

  r.unmount();
});
