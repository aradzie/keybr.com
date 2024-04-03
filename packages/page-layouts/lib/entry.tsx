import { init, Slot } from "@keybr/pages-browser";
import { type ReactNode } from "react";
import { LayoutsApp } from "./LayoutsApp.tsx";

init(
  <Slot selector="main">
    <Main />
  </Slot>,
);

function Main(): ReactNode {
  return <LayoutsApp />;
}
