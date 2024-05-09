import { clsx } from "clsx";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { useScreenSize } from "../../hooks/index.ts";
import { boundingBox, screenSize } from "../../utils/geometry.ts";
import { Point } from "../../utils/point.ts";
import { querySelector } from "../../utils/query.ts";
import { type Rect } from "../../utils/rect.ts";
import { move } from "./move.ts";
import * as styles from "./Popup.module.less";

export type PopupProps = {
  readonly anchor?: string;
  readonly children?: ReactNode;
  readonly position?: "e" | "s" | "w" | "n";
};

export function Popup({ children, anchor, position }: PopupProps): ReactNode {
  const refs = {
    popup: useRef<HTMLDivElement>(null),
  };

  useScreenSize();

  useLayoutEffect(() => {
    const popup = refs.popup.current;
    if (popup != null) {
      if (anchor == null || position == null) {
        const popupRect = boundingBox(popup);
        const { x, y } = centerPopup(popupRect);
        move(popup, { left: x, top: y });
      } else {
        const popupRect = boundingBox(popup);
        const anchorRect = boundingBox(querySelector(anchor));
        const { x, y } = align(popupRect, anchorRect, position);
        move(popup, { left: x, top: y });
      }
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
    <div ref={refs.popup} className={clsx(styles.root, styleName)}>
      {children}
    </div>
  );
}

Popup.isPopupElement = (el: Element): boolean => {
  return el instanceof HTMLElement && el.className.includes(styles.root);
};

function centerPopup(popupRect: Rect): Point {
  const size = screenSize();
  const x = (size.width - popupRect.width) / 2;
  const y = (size.height - popupRect.height) / 2;
  return new Point(x, y);
}

function align(popupRect: Rect, anchorRect: Rect, position: string): Point {
  const size = screenSize();
  const offset = 18;
  let x: number;
  let y: number;
  switch (position) {
    case "e":
      x = anchorRect.x + anchorRect.width + offset;
      y = anchorRect.y - (popupRect.height - anchorRect.height) / 2;
      break;
    case "s":
      x = anchorRect.x + (anchorRect.width - popupRect.width) / 2;
      y = anchorRect.y + anchorRect.height + offset;
      break;
    case "w":
      x = anchorRect.x - popupRect.width - offset;
      y = anchorRect.y - (popupRect.height - anchorRect.height) / 2;
      break;
    case "n":
      x = anchorRect.x + (anchorRect.width - popupRect.width) / 2;
      y = anchorRect.y - popupRect.height - offset;
      break;
    default:
      x = (size.width - popupRect.width) / 2;
      y = (size.height - popupRect.height) / 2;
      break;
  }
  return new Point(x, y);
}
