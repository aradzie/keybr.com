import { Cookie, SetCookie } from "@fastr/headers";
import { useFullscreen } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { ThemeContext } from "./context.ts";
import { ThemePrefs } from "./prefs.ts";
import { useSystemTheme } from "./system.ts";
import { COLORS, FONTS } from "./themes.ts";

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const fullscreenTarget =
    document.querySelector("[fullscreen-target]") ??
    document.querySelector("main") ??
    document.documentElement;

  const [fullscreenState, toggleFullscreen] = useFullscreen(fullscreenTarget);
  const [{ color, font }, setPrefs] = useState(() => readPrefs());
  useSystemTheme();

  return (
    <ThemeContext.Provider
      value={{
        fullscreenState,
        color,
        font,
        toggleFullscreen,
        switchColor: (color) => {
          const theme = COLORS.find(color);
          document.documentElement.setAttribute(
            ThemePrefs.colorAttrName,
            theme.id,
          );
          const prefs = new ThemePrefs({ color: theme.id, font });
          setPrefs(prefs);
          storePrefs(prefs);
        },
        switchFont: (font) => {
          const theme = FONTS.find(font);
          document.documentElement.setAttribute(
            ThemePrefs.fontAttrName,
            theme.id,
          );
          const prefs = new ThemePrefs({ color, font: theme.id });
          setPrefs(prefs);
          storePrefs(prefs);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function readPrefs(): ThemePrefs {
  return ThemePrefs.deserialize(
    Cookie.parse(document.cookie).get(ThemePrefs.cookieKey),
  );
}

function storePrefs(prefs: ThemePrefs): void {
  document.cookie = String(
    new SetCookie(ThemePrefs.cookieKey, ThemePrefs.serialize(prefs), {
      maxAge: 100 * 24 * 60 * 60,
      sameSite: "Lax",
    }),
  );
}
