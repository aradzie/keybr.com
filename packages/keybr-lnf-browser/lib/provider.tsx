import { Cookie, SetCookie } from "@fastr/headers";
import {
  type ColorName,
  COLORS,
  type FontName,
  FONTS,
  ThemeContext,
  ThemePrefs,
} from "@keybr/lnf";
import { type ReactNode, useState } from "react";
import { useFullscreen } from "./use-fullscreen.ts";

export function ThemeProvider({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  const [fullscreenState, toggleFullscreen] = useFullscreen();
  const [{ color, font }, setPrefs] = useState(() => readPrefs());

  const switchColor = (color: ColorName): void => {
    const { id } = COLORS.findOption(color);
    document.documentElement.setAttribute("data-color", id);
    const prefs = new ThemePrefs({ color, font });
    storePrefs(prefs);
    setPrefs(prefs);
  };

  const switchFont = (font: FontName): void => {
    const { id } = FONTS.findOption(font);
    document.documentElement.setAttribute("data-font", id);
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
