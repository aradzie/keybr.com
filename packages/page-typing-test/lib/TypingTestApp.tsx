import { useSettings } from "@keybr/settings";
import { makeStats, type Stats } from "@keybr/textinput";
import { type ReactNode, useMemo, useState } from "react";
import { Report } from "./component/Report.tsx";
import { SettingsScreen } from "./component/SettingsScreen.tsx";
import { TestScreen } from "./component/TestScreen.tsx";
import { TextGeneratorLoader } from "./generator/index.ts";
import { toCompositeSettings } from "./settings.ts";

export function TypingTestApp(): ReactNode {
  const enum View {
    Test,
    Report,
    Settings,
  }

  const { settings } = useSettings();
  const compositeSettings = useMemo(
    () => toCompositeSettings(settings),
    [settings],
  );
  const [view, setView] = useState(View.Test);
  const [stats, setStats] = useState<Stats>(makeStats([]));

  switch (view) {
    case View.Test:
      return (
        <TextGeneratorLoader textSource={compositeSettings.textSource}>
          {(textGenerator) => {
            return (
              <TestScreen
                settings={compositeSettings}
                textGenerator={textGenerator}
                onComplete={(stats) => {
                  setView(View.Report);
                  setStats(stats);
                }}
                onHelp={() => {}}
                onConfigure={() => {
                  setView(View.Settings);
                }}
              />
            );
          }}
        </TextGeneratorLoader>
      );
    case View.Report:
      return (
        <Report
          stats={stats!}
          onNext={() => {
            setView(View.Test);
          }}
        />
      );
    case View.Settings:
      return (
        <SettingsScreen
          onSubmit={() => {
            setView(View.Test);
          }}
        />
      );
  }
}
