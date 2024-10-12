import { Cookie, SetCookie } from "@fastr/headers";
import {
  ThemeContext,
  ThemePrefs,
  usePreferredColorScheme,
} from "@keybr/styles";
import { useFullscreen } from "@keybr/widget";
import { type ReactNode, useState } from "react";

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const fullscreenTarget =
    document.querySelector("[fullscreen-target]") ??
    document.querySelector("main") ??
    document.documentElement;

  const [fullscreenState, toggleFullscreen] = useFullscreen(fullscreenTarget);
  const [{ color, font }, setPrefs] = useState(() => readPrefs());
  usePreferredColorScheme();

  return (
    <ThemeContext.Provider
      value={{
        fullscreenState,
        color,
        font,
        toggleFullscreen,
        switchColor: (id) => {
          const prefs = new ThemePrefs({ color: id, font });
          switchTheme(prefs);
          setPrefs(prefs);
          storePrefs(prefs);
        },
        switchFont: (id) => {
          const prefs = new ThemePrefs({ color, font: id });
          switchTheme(prefs);
          setPrefs(prefs);
          storePrefs(prefs);
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
