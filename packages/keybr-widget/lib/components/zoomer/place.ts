import { getBoundingBox, getScreenSize, Rect } from "../../utils/index.ts";
import { type ZoomablePosition } from "./Zoomer.types.ts";

const screenMargin = 0;

export function place(root: HTMLElement) {
  const rootBox = getBoundingBox(root, "fixed");
  const screenSize = getScreenSize();
  const screenBox = new Rect(
    screenMargin,
    screenMargin,
    screenSize.width - screenMargin * 2,
    screenSize.height - screenMargin * 2,
  );
  const areaBox = new Rect(
    screenBox.x,
    screenBox.y,
    screenBox.width - rootBox.width,
    screenBox.height - rootBox.height,
  );

  const fitToScreen = ({ x, y, zoom }: ZoomablePosition) => {
    if (zoom > 3) {
      return { x, y, zoom: 3 };
    }
    if (zoom < 0.5) {
      return { x, y, zoom: 0.5 };
    }
    if (
      zoom > 1 &&
      (rootBox.width > screenBox.width || rootBox.height > screenBox.height)
    ) {
      zoom = Math.min(
        (screenBox.width / rootBox.width) * zoom,
        (screenBox.height / rootBox.height) * zoom,
      );
      return { x: Math.floor(x), y: Math.floor(y), zoom };
    }
    if (x !== 0) {
      if (rootBox.left < areaBox.left) {
        x += areaBox.left - rootBox.left;
      } else if (rootBox.left > areaBox.right) {
        x -= rootBox.left - areaBox.right;
      }
    }
    if (y !== 0) {
      if (rootBox.top < areaBox.top) {
        y += areaBox.top - rootBox.top;
      } else if (rootBox.top > areaBox.bottom) {
        y -= rootBox.top - areaBox.bottom;
      }
    }
    return { x: Math.floor(x), y: Math.floor(y), zoom };
  };

  return {
    fitToScreen,
  };
}
