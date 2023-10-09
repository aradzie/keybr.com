import { init, Slot } from "@keybr/pages-browser";
import { SettingsLoader } from "@keybr/settings-loader";
import { type ReactNode } from "react";
import { TypingTestApp } from "./TypingTestApp.tsx";

init(
  <Slot selector="main">
    <Main />
  </Slot>,
);

function Main(): ReactNode {
  return (
    <SettingsLoader>
      <TypingTestApp />
    </SettingsLoader>
  );
}
