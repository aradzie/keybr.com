import { Connector } from "@keybr/multiplayer-ui";
import { init, Slot } from "@keybr/pages-browser";
import { SettingsLoader } from "@keybr/settings-loader";
import { type ReactNode } from "react";

init(
  <Slot selector="main">
    <Main />
  </Slot>,
);

function Main(): ReactNode {
  return (
    <SettingsLoader>
      <Connector />
    </SettingsLoader>
  );
}
