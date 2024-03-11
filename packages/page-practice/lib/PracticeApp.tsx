import { useSettings } from "@keybr/settings";
import { type ReactNode, useState } from "react";
import { PracticeScreen } from "./practice/PracticeScreen.tsx";
import { SettingsScreen } from "./settings/SettingsScreen.tsx";

export function PracticeApp(): ReactNode {
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
