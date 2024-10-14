import { type LineList, type TextDisplaySettings } from "@keybr/textinput";
import { type ReactNode } from "react";
import { TextLines, type TextLineSize } from "./TextLines.tsx";

export function StaticText({
  settings,
  lines,
  wrap,
  size,
  cursor = false,
  focus = true,
}: {
  readonly settings?: TextDisplaySettings;
  readonly lines: LineList;
  readonly wrap?: boolean;
  readonly size?: TextLineSize;
  readonly cursor?: boolean;
  readonly focus?: boolean;
}): ReactNode {
  return (
    <TextLines
      settings={settings}
      lines={lines}
      wrap={wrap}
      size={size}
      cursor={cursor}
      focus={focus}
    />
  );
}
