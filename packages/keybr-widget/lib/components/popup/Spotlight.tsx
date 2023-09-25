import { createRef, type ReactNode, useLayoutEffect } from "react";
import { boundingBox } from "../../utils/geometry.ts";
import { querySelector } from "../../utils/query.ts";
import * as styles from "./Spotlight.module.less";
import { hide, show } from "./util.ts";

export type SpotlightProps = {
  readonly target?: string;
  readonly margin?: number;
};

export function Spotlight({ target, margin = 5 }: SpotlightProps): ReactNode {
  const c1Ref = createRef<HTMLDivElement>();
  const c2Ref = createRef<HTMLDivElement>();
  const c3Ref = createRef<HTMLDivElement>();
  const c4Ref = createRef<HTMLDivElement>();
  const markerRef = createRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const c1 = c1Ref.current;
    const c2 = c2Ref.current;
    const c3 = c3Ref.current;
    const c4 = c4Ref.current;
    const marker = markerRef.current;
    if (
      c1 == null ||
      c2 == null ||
      c3 == null ||
      c4 == null ||
      marker == null
    ) {
      return;
    }

    if (target == null) {
      hide(c1);
      hide(c2);
      hide(c3);
      hide(c4);
      hide(marker);
    } else {
      const targetRect = boundingBox(querySelector(target));
      const x = targetRect.x - margin;
      const y = targetRect.y - margin;
      const w = targetRect.width + margin * 2;
      const h = targetRect.height + margin * 2;
      show(c1, { left: 0, top: 0, width: x + w, height: y });
      show(c2, { left: x + w, top: 0, right: 0, height: y + h });
      show(c3, { left: x, top: y + h, right: 0, bottom: 0 });
      show(c4, { left: 0, top: y, width: x, bottom: 0 });
      show(marker, { left: x, top: y, width: w, height: h });
    }
  });

  return (
    <div className={styles.spotlight}>
      <div className={styles.c1} ref={c1Ref} />
      <div className={styles.c2} ref={c2Ref} />
      <div className={styles.c3} ref={c3Ref} />
      <div className={styles.c4} ref={c4Ref} />
      <div className={styles.marker} ref={markerRef} />
    </div>
  );
}
