import { useKeyboard } from "@keybr/keyboard";
import {
  KeyLayer,
  MarkerLayer,
  VirtualKeyboard,
  ZonesLayer,
} from "@keybr/keyboard-ui";
import { withDeferred } from "@keybr/widget";
import { memo, type ReactNode } from "react";

export const KeyboardPresenter = memo(function KeyboardPresenter({
  focus,
  depressedKeys,
}: {
  readonly focus: boolean;
  readonly depressedKeys: readonly string[];
}): ReactNode {
  const keyboard = useKeyboard();
  return (
    <VirtualKeyboard keyboard={keyboard}>
      <KeyLayer depressedKeys={depressedKeys} showZones={!focus} />
      {focus && <MarkerLayer />}
      {focus || <ZonesLayer />}
    </VirtualKeyboard>
  );
});

export const DeferredKeyboardPresenter = withDeferred(KeyboardPresenter);
