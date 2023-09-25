import { clsx } from "clsx";
import { createRef, type ReactNode, useLayoutEffect } from "react";
import { boundingBox, screenSize } from "../../utils/geometry.ts";
import { Point } from "../../utils/point.ts";
import { querySelector } from "../../utils/query.ts";
import { type Rect } from "../../utils/rect.ts";
import * as styles from "./Popup.module.less";
import { show } from "./util.ts";

export type PopupProps = {
  readonly children?: ReactNode;
  readonly target?: string;
  readonly position?: "e" | "s" | "w" | "n";
};

export function Popup({ children, target, position }: PopupProps): ReactNode {
  const popupRef = createRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const popup = popupRef.current;
    if (popup == null) {
      return;
    }

    if (target == null || position == null) {
      const popupRect = boundingBox(popup);
      const { x, y } = centerPopup(popupRect);
      show(popup, { left: x, top: y });
    } else {
      const popupRect = boundingBox(popup);
      const targetRect = boundingBox(querySelector(target));
      const { x, y } = align(popupRect, targetRect, position);
      show(popup, { left: x, top: y });
    }
  });

  let styleName;
  switch (position) {
    case "e":
      styleName = styles.e;
      break;
    case "s":
      styleName = styles.s;
      break;
    case "w":
      styleName = styles.w;
      break;
    case "n":
      styleName = styles.n;
      break;
  }

  return (
    <div ref={popupRef} className={clsx(styles.popup, styleName)}>
      {children}
    </div>
  );
}

function centerPopup(popupRect: Rect): Point {
  const size = screenSize();
  const x = (size.width - popupRect.width) / 2;
  const y = (size.height - popupRect.height) / 2;
  return new Point(x, y);
}

function align(popupRect: Rect, targetRect: Rect, position: string): Point {
  const size = screenSize();
  const offset = 18;
  let x: number;
  let y: number;
  switch (position) {
    case "e":
      x = targetRect.x + targetRect.width + offset;
      y = targetRect.y - (popupRect.height - targetRect.height) / 2;
      break;
    case "s":
      x = targetRect.x + (targetRect.width - popupRect.width) / 2;
      y = targetRect.y + targetRect.height + offset;
      break;
    case "w":
      x = targetRect.x - popupRect.width - offset;
      y = targetRect.y - (popupRect.height - targetRect.height) / 2;
      break;
    case "n":
      x = targetRect.x + (targetRect.width - popupRect.width) / 2;
      y = targetRect.y - popupRect.height - offset;
      break;
    default:
      x = (size.width - popupRect.width) / 2;
      y = (size.height - popupRect.height) / 2;
      break;
  }
  return new Point(x, y);
}
