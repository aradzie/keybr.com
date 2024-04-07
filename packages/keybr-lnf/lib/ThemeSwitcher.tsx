import { type ReactNode } from "react";
import * as styles from "./ThemeSwitcher.module.less";
import { ColorButton, FontButton, FullscreenButton } from "./widgets.tsx";

export function ThemeSwitcher(): ReactNode {
  return (
    <div className={styles.themeSwitcher}>
      <ColorButton />
      <FontButton />
      <FullscreenButton />
    </div>
  );
}

ThemeSwitcher.selector = `.${styles.themeSwitcher}`;
