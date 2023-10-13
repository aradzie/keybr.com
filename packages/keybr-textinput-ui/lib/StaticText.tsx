import {
  type Char,
  singleLine,
  type TextDisplaySettings,
} from "@keybr/textinput";
import { type ReactNode } from "react";
import * as styles from "./StaticText.module.less";
import { TextLines, type TextLineSize } from "./TextLines.tsx";

export function StaticText({
  settings,
  chars,
  wrap,
  size,
  cursor = false,
  focus = true,
}: {
  readonly settings?: TextDisplaySettings;
  readonly chars: readonly Char[];
  readonly wrap?: boolean;
  readonly size?: TextLineSize;
  readonly cursor?: boolean;
  readonly focus?: boolean;
}): ReactNode {
  return (
    <div className={styles.staticText}>
      <TextLines
        settings={settings}
        lines={singleLine(chars)}
        wrap={wrap}
        size={size}
        cursor={cursor}
        focus={focus}
      />
    </div>
  );
}
