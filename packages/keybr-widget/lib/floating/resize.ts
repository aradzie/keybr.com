import { px, type Size } from "../utils/index.ts";
import { type FloatingHeight, type FloatingWidth } from "./index.ts";

export function resizeElement(
  element: HTMLElement,
  anchorSize: Size,
  width: FloatingWidth | null,
  height: FloatingHeight | null,
): void {
  const { style } = element;
  if (width != null) {
    style.inlineSize = width === "anchor" ? px(anchorSize.width) : px(width);
  }
  if (height != null) {
    style.blockSize = height === "anchor" ? px(anchorSize.height) : px(height);
  }
}
