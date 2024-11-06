import { ReportScreen } from "./components/ReportScreen.tsx";
import { SettingsScreen } from "./components/SettingsScreen.tsx";
import { TestScreen } from "./components/TestScreen.tsx";

export const views = {
  test: TestScreen,
  report: ReportScreen,
  settings: SettingsScreen,
} as const;
