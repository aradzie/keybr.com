import { Settings, SettingsContext } from "@keybr/settings";
import { applyTheme, staticTheme, ThemeContext } from "@keybr/themes";
import { Box } from "@keybr/widget";
import { useEffect, useMemo, useRef } from "react";
import { useCustomTheme } from "../context/context.ts";
import { PreviewChart } from "./PreviewChart.tsx";
import { PreviewKeyboard } from "./PreviewKeyboard.tsx";
import { PreviewKeys } from "./PreviewKeys.tsx";
import * as styles from "./PreviewTab.module.less";
import { PreviewText } from "./PreviewText.tsx";
import { PreviewWidgets } from "./PreviewWidgets.tsx";

export function PreviewTab() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useCustomTheme();
  const settings = useMemo(
    () => ({
      settings: new Settings(),
      updateSettings: () => {},
    }),
    [],
  );
  useEffect(() => {
    applyTheme(theme, ref.current!.style);
  }, [theme]);
  return (
    <SettingsContext.Provider value={settings}>
      <ThemeContext.Provider value={staticTheme({ color: "*", font: "*" })}>
        <Box className={styles.root} direction="column">
          <div
            ref={ref}
            className={styles.scroll}
            style={{
              color: "var(--text-color)",
              backgroundColor: "var(--background-color)",
            }}
            data-preview-theme={true}
          >
            <PreviewWidgets />
            <PreviewKeys />
            <PreviewText />
            <PreviewKeyboard />
            <PreviewChart />
          </div>
        </Box>
      </ThemeContext.Provider>
    </SettingsContext.Provider>
  );
}
