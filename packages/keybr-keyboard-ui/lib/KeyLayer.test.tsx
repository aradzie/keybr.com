import { test } from "node:test";
import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { KeyLayer } from "./KeyLayer.tsx";

test("render", () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <KeyLayer />
    </KeyboardContext.Provider>,
  );

  assert.strictEqual(r.container.querySelectorAll(".key").length, 58);
  assert.strictEqual(r.container.querySelectorAll(".depressedKey").length, 0);
  assert.strictEqual(r.container.querySelectorAll(".symbol").length, 78);

  r.unmount();
});

test("update", () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <KeyLayer
        depressedKeys={["KeyA", "KeyB", "KeyC"]}
        toggledKeys={["CapsLock", "NumLock"]}
      />
    </KeyboardContext.Provider>,
  );

  assert.strictEqual(r.container.querySelectorAll(".key").length, 58);
  assert.strictEqual(r.container.querySelectorAll(".depressedKey").length, 3);
  assert.strictEqual(r.container.querySelectorAll(".symbol").length, 78);

  r.unmount();
});
