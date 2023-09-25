import { init, Slot } from "@keybr/pages-browser";
import { type ReactNode } from "react";
import { TextToolsApp } from "./TextToolsApp.tsx";

init(
  <Slot selector="#root">
    <Main />
  </Slot>,
);

function Main(): ReactNode {
  return <TextToolsApp />;
}
