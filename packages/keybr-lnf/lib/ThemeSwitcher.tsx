import { type ReactNode } from "react";
import * as styles from "./ThemeSwitcher.module.less";
import { FullscreenButton, TextSizeButton, ThemeButton } from "./widgets.tsx";

export function ThemeSwitcher(): ReactNode {
  return (
    <div className={styles.themeSwitcher}>
      <ThemeButton />
      <TextSizeButton />
      <FullscreenButton />
    </div>
  );
}

ThemeSwitcher.selector = `.${styles.themeSwitcher}`;
