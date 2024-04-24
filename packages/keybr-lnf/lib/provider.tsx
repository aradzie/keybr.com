import { Cookie, SetCookie } from "@fastr/headers";
import { useFullscreen } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { ThemeContext } from "./context.tsx";
import { COLORS, FONTS } from "./options.tsx";
import { ThemePrefs } from "./prefs.ts";
import { type ColorName, type FontName } from "./types.ts";

export function ThemeProvider({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  const [fullscreenState, toggleFullscreen] = useFullscreen(
    document.documentElement,
  );
  const [{ color, font }, setPrefs] = useState(() => readPrefs());

  const switchColor = (color: ColorName): void => {
    const { id } = COLORS.findOption(color);
    document.documentElement.setAttribute(ThemePrefs.colorAttrName, id);
    const prefs = new ThemePrefs({ color, font });
    storePrefs(prefs);
    setPrefs(prefs);
  };

  const switchFont = (font: FontName): void => {
    const { id } = FONTS.findOption(font);
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
