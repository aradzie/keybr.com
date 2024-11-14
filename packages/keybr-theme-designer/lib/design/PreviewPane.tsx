import { KeyboardProvider } from "@keybr/keyboard";
import {
  applyTheme,
  DynamicStylesProvider,
  staticTheme,
  ThemeContext,
} from "@keybr/themes";
import { type ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import { useCustomTheme } from "./context.ts";
import * as styles from "./PreviewPane.module.less";

export function PreviewPane({ children }: { readonly children: ReactNode }) {
  const { theme } = useCustomTheme();
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    applyTheme(theme, ref.current!.style);
  }, [theme]);
  const backgroundImage = useBackgroundImage();
  return (
    <ThemeContext.Provider
      value={staticTheme({ color: "*", font: "*" }, theme.hash())}
    >
      <div
        ref={ref}
        className={styles.root}
        style={{
          color: `var(--text-color)`,
          backgroundColor: `var(--background-color)`,
          backgroundImage,
        }}
        data-preview-theme={true}
      >
        <DynamicStylesProvider elementRef={ref}>
          <KeyboardProvider>{children}</KeyboardProvider>
        </DynamicStylesProvider>
      </div>
    </ThemeContext.Provider>
  );
}

function useBackgroundImage() {
  const { theme } = useCustomTheme();
  const color = String(theme.getColor("--primary-d1"));
  return useMemo(() => {
    const size = 50;
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>` +
      `<text fill='${color}' x='${size / 2}' y='${size / 2}' transform='rotate(-45 ${size / 2} ${size / 2})' text-anchor='middle' dominant-baseline='middle' font-size='15' font-family='sans-serif'>` +
      `Preview` +
      `</text>` +
      `</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [color]);
}
