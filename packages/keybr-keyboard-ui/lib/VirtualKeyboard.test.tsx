import { Geometry, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import test from "ava";
import { VirtualKeyboard } from "./VirtualKeyboard.tsx";

test.serial("render standard 101", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.ANSI_101);

  const r = render(<VirtualKeyboard keyboard={keyboard} />);

  t.pass();

  r.unmount();
});

test.serial("render standard 101 full", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.ANSI_101_FULL);

  const r = render(<VirtualKeyboard keyboard={keyboard} />);

  t.pass();

  r.unmount();
});
