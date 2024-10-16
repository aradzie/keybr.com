import {
  type CustomTheme,
  defaultCustomTheme,
  readTheme,
  storeTheme,
} from "@keybr/themes";
import { Alert, toast } from "@keybr/widget";
import { useEffect, useState } from "react";
import { CustomThemeContext } from "./design/context.ts";
import { DesignPane } from "./design/DesignPane.tsx";

export function ThemeDesigner() {
  const [theme, setTheme] = usePersistentCustomTheme();
  return (
    <CustomThemeContext.Provider value={{ theme, setTheme }}>
      <DesignPane />
    </CustomThemeContext.Provider>
  );
}

function usePersistentCustomTheme() {
  const [theme, setTheme] = useState<CustomTheme>(defaultCustomTheme);
  useEffect(() => {
    readTheme()
      .then(({ theme, error }) => {
        setTheme(defaultCustomTheme.merge(theme));
        if (error) {
          toast(<ErrorAlert error={error} />);
        }
      })
      .catch((err) => {
        console.error("Read theme error", err);
      });
  }, []);
  useEffect(() => {
    const id = setTimeout(() => {
      storeTheme(theme)
        .then(({ theme, error }) => {
          setTheme(theme);
          if (error) {
            toast(<ErrorAlert error={error} />);
          }
        })
        .catch((err) => {
          console.error("Store theme error", err);
        });
    }, 200);
    return () => {
      clearTimeout(id);
    };
  }, [theme]);
  return [theme, setTheme] as const;
}

function ErrorAlert({ error }: { readonly error: unknown }) {
  return (
    <Alert severity="error">
      {error instanceof AggregateError ? (
        error.errors.map((child, index) => <p key={index}>{String(child)}</p>)
      ) : (
        <p>{String(error)}</p>
      )}
    </Alert>
  );
}
