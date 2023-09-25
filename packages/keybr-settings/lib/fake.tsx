import { type ReactNode, useState } from "react";
import { SettingsContext } from "./context.ts";
import { Settings } from "./settings.ts";

export function FakeSettingsContext({
  initialSettings = new Settings(),
  children,
}: {
  readonly initialSettings?: Settings;
  readonly children: ReactNode;
}): ReactNode {
  const [settings, setSettings] = useState(initialSettings);
  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings: (newSettings) => {
          setSettings(newSettings);
        },
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
