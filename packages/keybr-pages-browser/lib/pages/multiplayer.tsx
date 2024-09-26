import { MultiplayerPage } from "@keybr/page-multiplayer";
import { ResultLoader } from "@keybr/result-loader";
import { SettingsLoader } from "@keybr/settings-loader";

export default function Page() {
  return (
    <SettingsLoader>
      <ResultLoader>
        <MultiplayerPage />
      </ResultLoader>
    </SettingsLoader>
  );
}
