import { Cookie, SetCookie } from "@fastr/headers";
import { useFullscreen } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { ThemeContext } from "./context.ts";
import { ThemePrefs } from "./prefs.ts";
import { COLORS, FONTS } from "./themes.ts";

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const fullscreenTarget =
    document.querySelector("[fullscreen-target]") ??
    document.querySelector("main") ??
    document.documentElement;

  const [fullscreenState, toggleFullscreen] = useFullscreen(fullscreenTarget);
  const [{ color, font }, setPrefs] = useState(() => readPrefs());

  const switchColor = (color: string): void => {
    const theme = COLORS.find(color);
    document.documentElement.setAttribute(ThemePrefs.colorAttrName, theme.id);
    const prefs = new ThemePrefs({ color: theme.id, font });
    setPrefs(prefs);
    storePrefs(prefs);
  };

  const switchFont = (font: string): void => {
    const theme = FONTS.find(font);
    document.documentElement.setAttribute(ThemePrefs.fontAttrName, theme.id);
    const prefs = new ThemePrefs({ color, font: theme.id });
    setPrefs(prefs);
    storePrefs(prefs);
  };

  return (
    <ThemeContext.Provider
      value={{
        fullscreenState,
        color,
        font,
        toggleFullscreen,
        switchColor,
        switchFont,
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
