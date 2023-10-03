import { Color, RgbColor } from "@keybr/widget";
import { type CSSProperties } from "react";

const MIN_CONFIDENCE_COLOR = Color.rgb(0xcc0000);
const MAX_CONFIDENCE_COLOR = Color.rgb(0x60d788);

export function confidenceColor(confidence: number): Color {
  return RgbColor.between(
    MIN_CONFIDENCE_COLOR,
    MAX_CONFIDENCE_COLOR,
    Math.max(0, Math.min(1, confidence)),
  );
}

export function keyStyle(
  isIncluded: boolean,
  confidence: number | null,
): CSSProperties {
  if (isIncluded && confidence != null) {
    return {
      backgroundColor: String(confidenceColor(confidence)),
    };
  } else {
    return {};
  }
}
