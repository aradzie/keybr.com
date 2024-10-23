import {
  type CustomTheme,
  customTheme,
  readTheme,
  storeTheme,
} from "@keybr/themes";
import { useEffect, useState } from "react";
import { CustomThemeContext } from "./design/context.ts";
import { DesignPane } from "./design/DesignPane.tsx";
import { reportError } from "./io/ErrorAlert.tsx";

export function ThemeDesigner() {
  const [theme, setTheme] = usePersistentCustomTheme();
  return (
    <CustomThemeContext.Provider value={{ theme, setTheme }}>
      <DesignPane />
    </CustomThemeContext.Provider>
  );
}

function usePersistentCustomTheme() {
  const [theme, setTheme] = useState<CustomTheme>(customTheme);
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
    const id = setTimeout(() => {
      storeTheme(theme)
        .then(({ theme, error }) => {
          setTheme(theme);
          if (error) {
            reportError(error);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }, 200);
    return () => {
      clearTimeout(id);
    };
  }, [theme]);
  return [theme, setTheme] as const;
}
