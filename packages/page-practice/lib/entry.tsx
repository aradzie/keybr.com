import { init, Slot } from "@keybr/pages-browser";
import { ResultLoader } from "@keybr/result-loader";
import { SettingsLoader } from "@keybr/settings-loader";
import { type ReactNode } from "react";
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
        <PracticeApp />
      </ResultLoader>
    </SettingsLoader>
  );
}
