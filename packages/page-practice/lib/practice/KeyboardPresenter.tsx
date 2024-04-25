import { keyboardProps, useKeyboard } from "@keybr/keyboard";
import {
  flatten,
  HeatmapLayer,
  KeyLayer,
  PointersLayer,
  TransitionsLayer,
  VirtualKeyboard,
  ZonesLayer,
} from "@keybr/keyboard-ui";
import { useSettings } from "@keybr/settings";
import { type CodePoint } from "@keybr/unicode";
import { withDeferred } from "@keybr/widget";
import { memo, type ReactNode, useState, type WheelEvent } from "react";
import { type LastLesson } from "./practicestate.ts";

export const KeyboardPresenter = memo(function KeyboardPresenter({
  focus,
  depressedKeys,
  toggledKeys,
  suffix,
  lastLesson,
}: {
  readonly focus: boolean;
  readonly depressedKeys: readonly string[];
  readonly toggledKeys: readonly string[];
  readonly suffix: readonly CodePoint[];
  readonly lastLesson: LastLesson | null;
}): ReactNode {
  const { settings } = useSettings();
  const keyboard = useKeyboard();
  const zoom = useZoom();
  const colors = settings.get(keyboardProps.colors);
  const pointers = settings.get(keyboardProps.pointers);
  return (
    <VirtualKeyboard keyboard={keyboard} height="16rem" {...zoom}>
      <KeyLayer
        depressedKeys={depressedKeys}
        toggledKeys={toggledKeys}
        showColors={colors}
      />
      {focus && pointers && <PointersLayer suffix={suffix} />}
      {focus && lastLesson && (
        <HeatmapLayer histogram={flatten(lastLesson.misses)} modifier="m" />
      )}
      {focus && lastLesson && (
        <HeatmapLayer histogram={flatten(lastLesson.hits)} modifier="h" />
      )}
      {focus && lastLesson && (
        <TransitionsLayer histogram={lastLesson.misses2} modifier="m" />
      )}
      {focus && lastLesson && (
        <TransitionsLayer histogram={lastLesson.hits2} modifier="h" />
      )}
      {focus || <ZonesLayer />}
    </VirtualKeyboard>
  );
});

function useZoom() {
  const [zoom, setZoom] = useState(1);
  const onWheel = (ev: WheelEvent): void => {
    if (ev.deltaY < 0) {
      setZoom(Math.min(1.5, zoom + 0.05));
    }
    if (ev.deltaY > 0) {
      setZoom(Math.max(0.5, zoom - 0.05));
    }
    ev.preventDefault();
    ev.stopPropagation();
  };
  return { onWheel, style: { transform: `scale(${zoom})` } };
}

export const DeferredKeyboardPresenter = withDeferred(KeyboardPresenter);
