import { KeyboardProvider } from "@keybr/keyboard";
import { init, Slot } from "@keybr/pages-browser";
import { SettingsLoader } from "@keybr/settings-loader";
import { TypingTestApp } from "./TypingTestApp.tsx";

init(
  <Slot selector="main">
    <SettingsLoader>
      <KeyboardProvider>
        <TypingTestApp />
      </KeyboardProvider>
    </SettingsLoader>
  </Slot>,
);
