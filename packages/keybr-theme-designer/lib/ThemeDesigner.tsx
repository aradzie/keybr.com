import { readTheme, storeTheme } from "@keybr/themes";
import { useDebounced } from "@keybr/widget";
import { useEffect, useState } from "react";
import { CustomThemeContext } from "./design/context.ts";
import { DesignPane } from "./design/DesignPane.tsx";
import { reportError } from "./io/ErrorAlert.tsx";
import { customTheme } from "./themes/themes.ts";

export function ThemeDesigner() {
  return (
    <CustomThemeContext.Provider value={usePersistentCustomTheme()}>
      <DesignPane />
    </CustomThemeContext.Provider>
  );
}

export function usePersistentCustomTheme() {
  const [theme, setTheme] = useState(customTheme);
  const debouncedTheme = useDebounced(theme, 300);
  useEffect(() => {
    readTheme()
      .then(({ theme, error }) => {
        setTheme(customTheme.merge(theme));
        reportError(error);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  useEffect(() => {
    storeTheme(debouncedTheme)
      .then(({ theme, error }) => {
        setTheme(theme);
        if (error) {
          reportError(error);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [debouncedTheme]);
  return { theme, setTheme };
}
