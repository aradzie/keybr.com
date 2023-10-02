import { useKeyboard } from "@keybr/keyboard";
import {
  HeatmapLayer,
  KeyLayer,
  MarkerLayer,
  VirtualKeyboard,
  ZonesLayer,
} from "@keybr/keyboard-ui";
import { withDeferred } from "@keybr/widget";
import { memo, type ReactNode, useState, type WheelEvent } from "react";
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
  const zoom = useZoom();
  return (
    <VirtualKeyboard keyboard={keyboard} height="16rem" {...zoom}>
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
