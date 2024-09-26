import { KeyboardOptions, Layout } from "@keybr/keyboard";
import { Settings, useSettings } from "@keybr/settings";
import { type ReactNode, useState } from "react";
import { PracticeScreen } from "./practice/PracticeScreen.tsx";
import { SettingsScreen } from "./settings/SettingsScreen.tsx";

setDefaultLayout(window.navigator.language);

function setDefaultLayout(localeId: string): void {
  const layout = Layout.findLayout(localeId);
  if (layout != null) {
    Settings.addDefaults(
      KeyboardOptions.default()
        .withLanguage(layout.language)
        .withLayout(layout)
        .save(new Settings()),
    );
  }
}

export function PracticePage(): ReactNode {
  const { updateSettings } = useSettings();
  const [configure, setConfigure] = useState(false);
  if (configure) {
    return (
      <SettingsScreen
        onSubmit={(newSettings) => {
          updateSettings(newSettings);
          setConfigure(false);
        }}
      />
    );
  } else {
    return (
      <PracticeScreen
        onConfigure={() => {
          setConfigure(true);
        }}
      />
    );
  }
}
