import { type Keyboard } from "@keybr/keyboard";
import { HeatmapLayer, KeyLayer, VirtualKeyboard } from "@keybr/keyboard-ui";
import { type KeyStatsMap } from "@keybr/result";
import { type ReactNode } from "react";
import { keyUsage } from "./keyusage.ts";

export function KeyFrequencyHeatmap({
  keyStatsMap,
  keyboard,
}: {
  readonly keyStatsMap: KeyStatsMap;
  readonly keyboard: Keyboard;
}): ReactNode {
  const { hit, miss } = keyUsage(keyStatsMap);
  return (
    <VirtualKeyboard keyboard={keyboard}>
      <KeyLayer />
      <HeatmapLayer histogram={miss.asMap()} modifier="m" />
      <HeatmapLayer histogram={hit.asMap()} modifier="h" />
    </VirtualKeyboard>
  );
}
