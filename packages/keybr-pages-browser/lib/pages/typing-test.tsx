import { TypingTestPage } from "@keybr/page-typing-test";
import { ResultLoader } from "@keybr/result-loader";
import { SettingsLoader } from "@keybr/settings-loader";

export default function Page() {
  return (
    <SettingsLoader>
      <ResultLoader>
        <TypingTestPage />
      </ResultLoader>
    </SettingsLoader>
  );
}
