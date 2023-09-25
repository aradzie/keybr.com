import { toChars } from "@keybr/textinput";
import { type TextDisplaySettings } from "@keybr/textinput-settings";
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
  const example = useMemo(
    () => generateExample(textGenerator),
    [textGenerator],
  );
  return <StaticText settings={settings} chars={toChars(example)} />;
});
