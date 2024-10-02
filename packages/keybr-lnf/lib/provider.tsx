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
    const { id } = COLORS.find(color);
    document.documentElement.setAttribute(ThemePrefs.colorAttrName, id);
    const prefs = new ThemePrefs({ color, font });
    storePrefs(prefs);
    setPrefs(prefs);
  };

  const switchFont = (font: string): void => {
    const { id } = FONTS.find(font);
    document.documentElement.setAttribute(ThemePrefs.fontAttrName, id);
    const prefs = new ThemePrefs({ color, font });
    storePrefs(prefs);
    setPrefs(prefs);
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
