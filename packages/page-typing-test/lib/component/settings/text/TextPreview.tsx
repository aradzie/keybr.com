import { singleLine, type TextDisplaySettings } from "@keybr/textinput";
import { StaticText } from "@keybr/textinput-ui";
import { memo, type ReactNode, useMemo } from "react";
import {
  generateExample,
  type TextGenerator,
} from "../../../generator/index.ts";

export const TextPreview = memo(function TextPreview({
  settings,
  textGenerator,
}: {
  readonly settings: TextDisplaySettings;
  readonly textGenerator: TextGenerator;
}): ReactNode {
  const text = useMemo(() => generateExample(textGenerator), [textGenerator]);
  return <StaticText settings={settings} lines={singleLine(text)} />;
});
