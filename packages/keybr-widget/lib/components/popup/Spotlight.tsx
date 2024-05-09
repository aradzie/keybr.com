import { type ReactNode, useLayoutEffect, useRef } from "react";
import { boundingBox } from "../../utils/geometry.ts";
import { querySelector } from "../../utils/query.ts";
import { move } from "./move.ts";
import * as styles from "./Spotlight.module.less";

export type SpotlightProps = {
  readonly anchor?: string;
  readonly margin?: number;
};

export function Spotlight({ anchor, margin = 15 }: SpotlightProps): ReactNode {
  const refs = {
    c1: useRef<HTMLDivElement>(null),
    c2: useRef<HTMLDivElement>(null),
    c3: useRef<HTMLDivElement>(null),
    c4: useRef<HTMLDivElement>(null),
    marker: useRef<HTMLDivElement>(null),
  };

  useLayoutEffect(() => {
    const c1 = refs.c1.current;
    const c2 = refs.c2.current;
    const c3 = refs.c3.current;
    const c4 = refs.c4.current;
    const marker = refs.marker.current;
    if (
      anchor != null &&
      c1 != null &&
      c2 != null &&
      c3 != null &&
      c4 != null &&
      marker != null
    ) {
      const anchorRect = boundingBox(querySelector(anchor));
      const x = anchorRect.x - margin;
      const y = anchorRect.y - margin;
      const w = anchorRect.width + margin * 2;
      const h = anchorRect.height + margin * 2;
      move(c1, { left: 0, top: 0, width: x + w, height: y });
      move(c2, { left: x + w, top: 0, right: 0, height: y + h });
      move(c3, { left: x, top: y + h, right: 0, bottom: 0 });
      move(c4, { left: 0, top: y, width: x, bottom: 0 });
      move(marker, { left: x, top: y, width: w, height: h });
    }
  });

  return (
    <div className={styles.root}>
      {anchor && (
        <>
          <div ref={refs.c1} className={styles.c1} />
          <div ref={refs.c2} className={styles.c2} />
          <div ref={refs.c3} className={styles.c3} />
          <div ref={refs.c4} className={styles.c4} />
          <div ref={refs.marker} className={styles.marker} />
        </>
      )}
    </div>
  );
}
