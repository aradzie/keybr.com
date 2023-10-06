import { useSettings } from "@keybr/settings";
import { toTextDisplaySettings } from "@keybr/textinput";
import { AnimatedText } from "@keybr/textinput-ui";
import { HBox } from "@keybr/widget";
import { type ReactNode } from "react";
import * as styles from "./ExampleText.module.less";

export function ExampleText({
  text = "The quick brown fox jumps over the lazy dog.",
}: {
  readonly text?: string;
}): ReactNode {
  const { settings } = useSettings();
  return (
    <HBox justifyContent="center" className={styles.exampleText}>
      <AnimatedText settings={toTextDisplaySettings(settings)} text={text} />
    </HBox>
  );
}
