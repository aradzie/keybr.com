import { type KeyId, useKeyboard } from "@keybr/keyboard";
import { KeyLayer, VirtualKeyboard } from "@keybr/keyboard-ui";
import { Tasks } from "@keybr/lang";
import {
  type LineList,
  type Step,
  type TextInputSettings,
} from "@keybr/textinput";
import { type AnyEvent } from "@keybr/textinput-events";
import { StaticText } from "@keybr/textinput-ui";
import { Box, useDocumentVisibility } from "@keybr/widget";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ReplayState, Session, type TestResult } from "../session/index.ts";
import { type CompositeSettings } from "../settings.ts";
import { Progress } from "./Progress.tsx";
import * as styles from "./Replay.module.less";

export function Replay({
  settings: { textInput, textDisplay },
  result: { steps, events },
}: {
  readonly settings: CompositeSettings;
  readonly result: TestResult;
}): ReactNode {
  const keyboard = useKeyboard();
  const { stepper, lines, depressedKeys } = useReplayState(
    textInput,
    steps,
    events,
  );
  return (
    <div className={styles.root}>
      <Progress stepper={stepper} />
      <Box className={styles.text} alignItems="center" justifyContent="center">
        <StaticText settings={textDisplay} lines={lines} cursor={true} />
      </Box>
      <VirtualKeyboard keyboard={keyboard} height="16rem">
        <KeyLayer depressedKeys={depressedKeys} />
      </VirtualKeyboard>
    </div>
  );
}

function useReplayState(
  settings: TextInputSettings,
  steps: readonly Step[],
  events: readonly AnyEvent[],
) {
  const stepper = useMemo(
    () => new ReplayState(settings, steps, events),
    [settings, steps, events],
  );
  const visible = useDocumentVisibility();
  const [lines, setLines] = useState<LineList>(Session.emptyLines);
  const [depressedKeys, setDepressedKeys] = useState<KeyId[]>([]);
  useEffect(() => {
    const tasks = new Tasks();
    const step = () => {
      stepper.step();
      setLines(stepper.lines);
      setDepressedKeys(stepper.depressedKeys);
      tasks.delayed(stepper.delay, step);
    };
    if (visible) {
      stepper.reset();
      setLines(stepper.lines);
      setDepressedKeys(stepper.depressedKeys);
      tasks.delayed(stepper.delay, step);
    }
    return () => {
      tasks.cancelAll();
    };
  }, [stepper, visible]);
  return { stepper, lines, depressedKeys };
}
