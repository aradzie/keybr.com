import { KeyboardOptions, Layout } from "@keybr/keyboard";
import { init, Slot } from "@keybr/pages-browser";
import { ResultLoader } from "@keybr/result-loader";
import { Settings } from "@keybr/settings";
import { SettingsLoader } from "@keybr/settings-loader";
import { type ReactNode } from "react";
import { ResultTrimmer } from "./debug.tsx";
import { PracticeApp } from "./PracticeApp.tsx";

setDefaultLayout(window.navigator.language);

init(
  <Slot selector="main">
    <Main />
  </Slot>,
);

function Main(): ReactNode {
  return (
    <SettingsLoader>
      <ResultLoader>
        <ResultTrimmer>
          <PracticeApp />
        </ResultTrimmer>
      </ResultLoader>
    </SettingsLoader>
  );
}

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
