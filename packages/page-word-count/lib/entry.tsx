import { init, Slot } from "@keybr/pages-browser";
import { type ReactNode } from "react";
import { WordCountApp } from "./WordCountApp.tsx";

init(
  <Slot selector="#root">
    <Main />
  </Slot>,
);

function Main(): ReactNode {
  return <WordCountApp />;
}
