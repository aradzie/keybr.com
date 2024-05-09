import { type ReactNode, useLayoutEffect, useRef } from "react";
import { placeElement } from "../../floating/index.ts";
import { useScreenSize } from "../../hooks/index.ts";
import { getBoundingBox } from "../../utils/geometry.ts";
import { querySelector } from "../../utils/query.ts";
import * as styles from "./Spotlight.module.less";

export type SpotlightProps = {
  readonly anchor?: string;
  readonly margin?: number;
};

export function Spotlight({ anchor, margin = 10 }: SpotlightProps): ReactNode {
  const c1Ref = useRef<HTMLDivElement>(null);
  const c2Ref = useRef<HTMLDivElement>(null);
  const c3Ref = useRef<HTMLDivElement>(null);
  const c4Ref = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();
  useLayoutEffect(() => {
    const c1 = c1Ref.current;
    const c2 = c2Ref.current;
    const c3 = c3Ref.current;
    const c4 = c4Ref.current;
    const marker = markerRef.current;
    if (
      anchor != null &&
      c1 != null &&
      c2 != null &&
      c3 != null &&
      c4 != null &&
      marker != null
    ) {
      const anchorBox = getBoundingBox(querySelector(anchor), "fixed");
      const x = anchorBox.x - margin;
      const y = anchorBox.y - margin;
      const w = anchorBox.width + margin * 2;
      const h = anchorBox.height + margin * 2;
      placeElement(c1, { left: 0, top: 0, width: x + w, height: y });
      placeElement(c2, { left: x + w, top: 0, right: 0, height: y + h });
      placeElement(c3, { left: x, top: y + h, right: 0, bottom: 0 });
      placeElement(c4, { left: 0, top: y, width: x, bottom: 0 });
      placeElement(marker, { left: x, top: y, width: w, height: h });
    }
  }, [anchor, margin, screenSize]);
  return (
    <div className={styles.root}>
      {anchor && (
        <>
          <div ref={c1Ref} className={styles.c1} />
          <div ref={c2Ref} className={styles.c2} />
          <div ref={c3Ref} className={styles.c3} />
          <div ref={c4Ref} className={styles.c4} />
          <div ref={markerRef} className={styles.marker} />
        </>
      )}
    </div>
  );
}
