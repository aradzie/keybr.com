import { Cookie, SetCookie } from "@fastr/headers";
import {
  applyTheme,
  clearTheme,
  readTheme,
  ThemeContext,
  ThemePrefs,
  usePreferredColorScheme,
} from "@keybr/themes";
import { useFullscreen } from "@keybr/widget";
import { type ReactNode, useEffect, useState } from "react";

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const fullscreenTarget =
    document.querySelector("[fullscreen-target]") ??
    document.querySelector("main") ??
    document.documentElement;

  const [fullscreenState, toggleFullscreen] = useFullscreen(fullscreenTarget);
  const [{ color, font }, setPrefs] = useState(() => readPrefs());
  const [hash, setHash] = useState(0);
  usePreferredColorScheme();

  useEffect(() => {
    if (color === "custom") {
      readTheme()
        .then(({ theme }) => {
          applyTheme(theme);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      clearTheme();
    }
  }, [color]);

  return (
    <ThemeContext.Provider
      value={{
        fullscreenState,
        color,
        font,
        hash,
        toggleFullscreen,
        switchColor: (id) => {
          const prefs = new ThemePrefs({ color: id, font });
          switchTheme(prefs);
          setPrefs(prefs);
          setHash(hash + 1);
          storePrefs(prefs);
        },
        switchFont: (id) => {
          const prefs = new ThemePrefs({ color, font: id });
          switchTheme(prefs);
          setPrefs(prefs);
          setHash(hash + 1);
          storePrefs(prefs);
        },
        refresh: () => {
          setHash(hash + 1);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function switchTheme(prefs: ThemePrefs) {
  ((elem) => {
    elem.setAttribute(ThemePrefs.colorAttrName, prefs.color);
    elem.setAttribute(ThemePrefs.fontAttrName, prefs.font);
  })(document.documentElement);
}

function readPrefs() {
  return ThemePrefs.deserialize(
    Cookie.parse(document.cookie).get(ThemePrefs.cookieKey),
  );
}

function storePrefs(prefs: ThemePrefs) {
  document.cookie = String(
    new SetCookie(ThemePrefs.cookieKey, ThemePrefs.serialize(prefs), {
      maxAge: 100 * 24 * 60 * 60,
      sameSite: "Lax",
    }),
  );
}
