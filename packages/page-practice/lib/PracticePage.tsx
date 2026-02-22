import { KeyboardOptions, Layout } from "@keybr/keyboard";
import { UrlTextContext } from "@keybr/pages-shared";
import { Settings } from "@keybr/settings";
import { ViewSwitch } from "@keybr/widget";
import { type ReactNode } from "react";
import { useUrlCustomText } from "./practice/useUrlCustomText.ts";
import { views } from "./views.tsx";

setDefaultLayout(window.navigator.language);

function setDefaultLayout(localeId: string) {
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

export function PracticePage() {
  const urlText = useUrlCustomText();
  return (
    <UrlTextContext.Provider value={urlText}>
      <ViewSwitch views={views} />
    </UrlTextContext.Provider>
  );
}
