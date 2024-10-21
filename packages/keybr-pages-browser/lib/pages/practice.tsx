import { PracticePage } from "@keybr/page-practice";
import { ResultLoader } from "@keybr/result-loader";

export default function Page() {
  return (
    <ResultLoader>
      <PracticePage />
    </ResultLoader>
  );
}
