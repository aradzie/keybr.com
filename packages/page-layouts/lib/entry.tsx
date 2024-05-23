import { init, Slot } from "@keybr/pages-browser";
import { LayoutsApp } from "./LayoutsApp.tsx";

init(
  <Slot selector="main">
    <LayoutsApp />
  </Slot>,
);
