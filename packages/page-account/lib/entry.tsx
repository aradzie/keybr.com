import { init, Slot } from "@keybr/pages-browser";
import { AccountApp } from "./browser/AccountApp.tsx";

init(
  <Slot selector="main">
    <AccountApp />
  </Slot>,
);
