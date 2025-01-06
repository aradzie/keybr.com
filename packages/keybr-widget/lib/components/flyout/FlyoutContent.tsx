import { type ReactElement, useLayoutEffect, useMemo, useRef } from "react";
import {
  type AlignOptions,
  type FloatingHeight,
  type FloatingWidth,
  place,
} from "../../floating/index.ts";
import { useScreenSize } from "../../hooks/index.ts";
import { Portal } from "../portal/index.ts";
import { useFlyout } from "./Flyout.context.ts";

export type FlyoutContentProps = {
  readonly children: ReactElement;
  readonly height?: FloatingHeight;
  readonly width?: FloatingWidth;
} & Partial<AlignOptions>;

export function FlyoutContent({
  children,
  flip,
  height = null,
  offset,
  position,
  screenMargin,
  shift,
  width = null,
}: FlyoutContentProps): ReactElement {
  const { anchorRef, open } = useFlyout();
  const contentRef = useRef<HTMLDivElement>(null);
  const options = useMemo(
    () => ({ position, flip, shift, offset, screenMargin }),
    [position, flip, shift, offset, screenMargin],
  );
  const screenSize = useScreenSize();
  useLayoutEffect(() => {
    if (contentRef.current != null) {
      const anchorBox = anchorRef.current!.getBoundingBox();
      place(contentRef.current!)
        .withOptions(options)
        .resize(anchorBox, width, height)
        .alignToAnchor(anchorBox, screenSize);
    }
  }, [anchorRef, contentRef, open, options, screenSize, width, height]);
  return (
    <>
      {open && (
        <Portal>
          <div ref={contentRef} style={{ position: "fixed", zIndex: 1 }}>
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}
