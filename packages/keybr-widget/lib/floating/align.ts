import { type Rect, type Size } from "../utils/index.ts";
import { type Place } from "./place.ts";
import { type AlignOptions, type FloatingPosition } from "./types.ts";
import { splitPosition } from "./util.ts";

export function centerToScreen(
  { width, height }: Size,
  screenSize: Size,
): Place {
  const left = (screenSize.width - width) / 2;
  const top = (screenSize.height - height) / 2;
  return { left, top };
}

export function alignToAnchor(
  size: Size,
  anchor: Rect,
  screenSize: Size,
  {
    position = "block-end",
    flip = true,
    shift = true,
    offset = 0,
    screenMargin = 20,
  }: Partial<AlignOptions> = {},
): [popup: Place, arrow: Place] {
  if (position === "auto") {
    position = autoPosition(size, anchor, screenSize);
  }
  let [side, placement] = splitPosition(position);

  const { width, height } = size;
  let left = 0;
  let top = 0;
  let arrowLeft = 0;
  let arrowTop = 0;

  // Align along the main axis.
  switch (side) {
    case "block-start":
      top = anchor.top - height - offset;
      arrowTop = anchor.top - offset;
      break;
    case "block-end":
      top = anchor.bottom + offset;
      arrowTop = anchor.bottom + offset;
      break;
    case "inline-start":
      left = anchor.left - width - offset;
      arrowLeft = anchor.left - offset;
      break;
    case "inline-end":
      left = anchor.right + offset;
      arrowLeft = anchor.right + offset;
      break;
  }

  // Align along the cross axis.
  switch (side) {
    case "block-start":
    case "block-end":
      switch (placement) {
        case "center":
          left = anchor.left + (anchor.width - width) / 2;
          break;
        case "start":
          left = anchor.left;
          break;
        case "end":
          left = anchor.right - width;
          break;
      }
      arrowLeft = anchor.left + anchor.width / 2;
      break;
    case "inline-start":
    case "inline-end":
      switch (placement) {
        case "center":
          top = anchor.top - (height - anchor.height) / 2;
          break;
        case "start":
          top = anchor.top;
          break;
        case "end":
          top = anchor.bottom - height;
          break;
      }
      arrowTop = anchor.top + anchor.height / 2;
      break;
  }

  if (flip) {
    // Change the position of the floating element to keep it in view.
    const topSpace = anchor.top;
    const bottomSpace = screenSize.height - anchor.bottom;
    const leftSpace = anchor.left;
    const rightSpace = screenSize.width - anchor.right;
    switch (side) {
      case "block-start":
        // Flip to the bottom.
        if (height > topSpace && height <= bottomSpace) {
          side = "block-end";
          top = anchor.bottom + offset;
          arrowTop = anchor.bottom + offset;
        }
        break;
      case "block-end":
        // Flip to the top.
        if (height > bottomSpace && height <= topSpace) {
          side = "block-start";
          top = anchor.top - height - offset;
          arrowTop = anchor.top - offset;
        }
        break;
      case "inline-start":
        // Flip to the right.
        if (width > leftSpace && width <= rightSpace) {
          side = "inline-end";
          left = anchor.right + offset;
          arrowLeft = anchor.right + offset;
        }
        break;
      case "inline-end":
        // Flip to the left.
        if (width > rightSpace && width <= leftSpace) {
          side = "inline-start";
          left = anchor.left - width - offset;
          arrowLeft = anchor.left - offset;
        }
        break;
    }
  }

  if (shift) {
    // Shift the floating element to keep it in view.
    switch (side) {
      case "block-start":
      case "block-end":
        // Adjust the right margin.
        left = Math.min(left, screenSize.width - width - screenMargin);
        // Adjust the left margin.
        left = Math.max(left, screenMargin);
        break;
      case "inline-start":
      case "inline-end":
        // Adjust the bottom margin.
        top = Math.min(top, screenSize.height - height - screenMargin);
        // Adjust the top margin.
        top = Math.max(top, screenMargin);
        break;
    }
  }

  return [
    { left, top },
    { left: arrowLeft - left, top: arrowTop - top },
  ];
}

export function autoPosition(
  { width, height }: Size,
  anchor: Rect,
  screenSize: Size,
): FloatingPosition {
  const topSpace = anchor.top;
  const bottomSpace = screenSize.height - anchor.bottom;
  const leftSpace = anchor.left;
  const rightSpace = screenSize.width - anchor.right;

  const topExcess = topSpace - height;
  const bottomExcess = bottomSpace - height;
  const leftExcess = leftSpace - width;
  const rightExcess = rightSpace - width;

  if (topExcess > 0 || bottomExcess > 0) {
    return topExcess > bottomExcess ? "block-start" : "block-end";
  }

  if (leftExcess > 0 || rightExcess > 0) {
    return leftExcess > rightExcess ? "inline-start" : "inline-end";
  }

  return "block-end";
}
