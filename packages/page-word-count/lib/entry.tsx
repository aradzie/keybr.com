import { init, Slot } from "@keybr/pages-browser";
import { WordCountApp } from "./WordCountApp.tsx";

init(
  <Slot selector="main">
    <WordCountApp />
  </Slot>,
);
