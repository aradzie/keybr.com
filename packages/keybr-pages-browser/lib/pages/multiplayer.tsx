import { MultiplayerPage } from "@keybr/page-multiplayer";
import { ResultLoader } from "@keybr/result-loader";

export default function Page() {
  return (
    <ResultLoader>
      <MultiplayerPage />
    </ResultLoader>
  );
}
