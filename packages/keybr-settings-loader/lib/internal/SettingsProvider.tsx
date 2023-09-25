import { catchError } from "@keybr/debug";
import {
  type Settings,
  SettingsContext,
  type SettingsStorage,
} from "@keybr/settings";
import { type ReactNode, useState } from "react";

export function SettingsProvider({
  storage,
  initialSettings,
  children,
}: {
  readonly storage: SettingsStorage;
  readonly initialSettings: Settings;
  readonly children: ReactNode;
}): ReactNode {
  const [settings, setSettings] = useState(initialSettings);
  return (
    <SettingsContext.Provider
      value={{
        settings: settings,
        updateSettings: (newSettings) => {
          storage.store(newSettings).catch(catchError);
          setSettings(newSettings);
        },
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
