import { type KeyId, useKeyboard } from "@keybr/keyboard";
import { KeyLayer, VirtualKeyboard } from "@keybr/keyboard-ui";
import { type AnyEvent } from "@keybr/textinput-events";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ReplayState } from "../session/index.ts";

export function Replay({
  events,
}: {
  readonly events: readonly AnyEvent[];
}): ReactNode {
  const keyboard = useKeyboard();
  const depressedKeys = useReplayState(events);
  return (
    <VirtualKeyboard keyboard={keyboard} height="16rem">
      <KeyLayer depressedKeys={depressedKeys} />
    </VirtualKeyboard>
  );
}

function useReplayState(events: readonly AnyEvent[]) {
  const stepper = useMemo(() => new ReplayState(events), [events]);
  const [depressedKeys, setDepressedKeys] = useState<KeyId[]>([]);
  useEffect(() => {
    let id = 0;
    const step = () => {
      stepper.step();
      setDepressedKeys(stepper.depressedKeys);
      id = window.setTimeout(step, stepper.delay);
    };
    setDepressedKeys(stepper.depressedKeys);
    id = window.setTimeout(step, stepper.delay);
    return () => {
      window.clearTimeout(id);
    };
  }, [stepper]);
  return depressedKeys;
}
