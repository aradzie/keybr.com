import { init, Slot } from "@keybr/pages-browser";
import { type ReactNode } from "react";
import { TypingTestApp } from "./TypingTestApp.tsx";

init(
  <Slot selector="main">
    <Main />
  </Slot>,
);

function Main(): ReactNode {
  return <TypingTestApp />;
}
