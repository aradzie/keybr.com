import { KeyboardProvider } from "@keybr/keyboard";
import { Connector } from "@keybr/multiplayer-ui";
import { init, Slot } from "@keybr/pages-browser";
import { SettingsLoader } from "@keybr/settings-loader";

init(
  <Slot selector="main">
    <SettingsLoader>
      <KeyboardProvider>
        <Connector />
      </KeyboardProvider>
    </SettingsLoader>
  </Slot>,
);
