import {
  type CustomTheme,
  defaultCustomTheme,
  readTheme,
  storeTheme,
} from "@keybr/themes";
import { Tab, TabList } from "@keybr/widget";
import { useEffect, useState } from "react";
import { CustomThemeContext } from "./context/context.ts";
import { DesignTab } from "./design/DesignTab.tsx";
import { PreviewTab } from "./preview/PreviewTab.tsx";
import * as styles from "./ThemeDesigner.module.less";

export function ThemeDesigner() {
  const [theme, setTheme, error] = usePersistentCustomTheme();
  const [index, setIndex] = useState(0);
  return (
    <CustomThemeContext.Provider value={{ theme, setTheme }}>
      <section className={styles.root}>
        {error && <p>{String(error)}</p>}
        <TabList selectedIndex={index} onSelect={setIndex}>
          <Tab label="Design">
            <DesignTab />
          </Tab>
          <Tab label="Preview">
            <PreviewTab />
          </Tab>
        </TabList>
      </section>
    </CustomThemeContext.Provider>
  );
}

function usePersistentCustomTheme() {
  const [theme, setTheme] = useState<CustomTheme>(defaultCustomTheme);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    readTheme()
      .then(({ theme, error }) => {
        setTheme(theme);
        setError(error);
      })
      .catch(setError);
  }, []);
  useEffect(() => {
    const id = setTimeout(() => {
      storeTheme(theme)
        .then(({ theme, error }) => {
          setTheme(theme);
          setError(error);
        })
        .catch(setError);
    }, 200);
    return () => {
      clearTimeout(id);
    };
  }, [theme]);
  return [
    theme,
    (value: CustomTheme) => {
      setTheme(value);
      setError(null);
    },
    error,
  ] as const;
}
