import { useKeyboard } from "@keybr/keyboard";
import {
  HeatmapLayer,
  KeyLayer,
  MarkerLayer,
  VirtualKeyboard,
  ZonesLayer,
} from "@keybr/keyboard-ui";
import { withDeferred } from "@keybr/widget";
import { memo, type ReactNode } from "react";
import { type LastLesson } from "./practicestate.ts";

export const KeyboardPresenter = memo(function KeyboardPresenter({
  focus,
  depressedKeys,
  lastLesson,
}: {
  readonly focus: boolean;
  readonly depressedKeys: readonly string[];
  readonly lastLesson: LastLesson | null;
}): ReactNode {
  const keyboard = useKeyboard();
  return (
    <VirtualKeyboard keyboard={keyboard} height="16rem">
      <KeyLayer depressedKeys={depressedKeys} showZones={!focus} />
      {focus && <MarkerLayer />}
      {focus && lastLesson && (
        <HeatmapLayer histogram={lastLesson.misses} modifier="m" />
      )}
      {focus && lastLesson && (
        <HeatmapLayer histogram={lastLesson.hits} modifier="h" />
      )}
      {focus || <ZonesLayer />}
    </VirtualKeyboard>
  );
});

export const DeferredKeyboardPresenter = withDeferred(KeyboardPresenter);
