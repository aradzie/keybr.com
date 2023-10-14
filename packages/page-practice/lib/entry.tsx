import { init, Slot } from "@keybr/pages-browser";
import { ResultLoader } from "@keybr/result-loader";
import { SettingsLoader } from "@keybr/settings-loader";
import { type ReactNode } from "react";
import { ResultTrimmer } from "./debug.tsx";
import { PracticeApp } from "./PracticeApp.tsx";

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
