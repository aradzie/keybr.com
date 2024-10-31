import { test } from "node:test";
import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { ZonesLayer } from "./ZonesLayer.tsx";

test("render", () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <ZonesLayer />
    </KeyboardContext.Provider>,
  );

  r.unmount();
});
