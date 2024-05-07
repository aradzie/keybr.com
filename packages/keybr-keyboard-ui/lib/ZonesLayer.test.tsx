import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import test from "ava";
import { ZonesLayer } from "./ZonesLayer.tsx";

test.serial("render", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <ZonesLayer />
    </KeyboardContext.Provider>,
  );

  t.pass();

  r.unmount();
});
