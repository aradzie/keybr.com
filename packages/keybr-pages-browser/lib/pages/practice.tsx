import { PracticePage } from "@keybr/page-practice";
import { ResultLoader } from "@keybr/result-loader";
import { SettingsLoader } from "@keybr/settings-loader";

export default function Page() {
  return (
    <SettingsLoader>
      <ResultLoader>
        <PracticePage />
      </ResultLoader>
    </SettingsLoader>
  );
}
