import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { type FloatingPosition, place } from "../../floating/index.ts";
import { useScreenSize } from "../../hooks/index.ts";
import { getBoundingBox, querySelector } from "../../utils/index.ts";
import * as styles from "./Popup.module.less";

export type PopupProps = {
  readonly anchor?: string;
  readonly children?: ReactNode;
  readonly position?: FloatingPosition;
  readonly offset?: number;
};

export function Popup({
  anchor,
  children,
  position,
  offset = 20,
  ...props
}: PopupProps): ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const options = useMemo(() => ({ position, offset }), [position, offset]);
  const screenSize = useScreenSize();
  useEffect(() => {
    if (rootRef.current != null)
      if (anchor == null) {
        place(rootRef.current!).centerToScreen(screenSize);
      } else {
        const anchorBox = getBoundingBox(querySelector(anchor), "absolute");
        place(rootRef.current!, arrowRef.current!)
          .withOptions(options)
          .alignToAnchor(anchorBox, screenSize);
      }
  }, [anchor, options, screenSize]);
  return (
    <div {...props} ref={rootRef} className={styles.root}>
      {children}
      {anchor && <div ref={arrowRef} className={styles.arrow} />}
    </div>
  );
}

Popup.isPopupElement = (el: Element): boolean => {
  return el instanceof HTMLElement && el.className.includes(styles.root);
};
