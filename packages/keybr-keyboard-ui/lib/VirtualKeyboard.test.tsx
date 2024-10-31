import { test } from "node:test";
import { Geometry, Layout, loadKeyboard } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { VirtualKeyboard } from "./VirtualKeyboard.tsx";

test("render standard 101", () => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.ANSI_101);

  const r = render(<VirtualKeyboard keyboard={keyboard} />);

  r.unmount();
});

test("render standard 101 full", () => {
  const keyboard = loadKeyboard(Layout.EN_US, Geometry.ANSI_101_FULL);

  const r = render(<VirtualKeyboard keyboard={keyboard} />);

  r.unmount();
});
