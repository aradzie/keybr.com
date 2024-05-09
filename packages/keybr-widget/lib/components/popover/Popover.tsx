import {
  cloneElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { type Anchor, place } from "../../floating/index.ts";
import { useScreenSize } from "../../hooks/index.ts";
import { Portal } from "../portal/index.ts";
import { type PopoverProps } from "./Popover.types.ts";

export function Popover({
  anchor,
  children,
  flip,
  height = null,
  offset,
  open,
  position,
  screenMargin,
  shift,
  width = null,
  ...props
}: PopoverProps): ReactNode {
  const anchorRef = useRef<Anchor>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const options = useMemo(
    () => ({ position, flip, shift, offset, screenMargin }),
    [position, flip, shift, offset, screenMargin],
  );
  const screenSize = useScreenSize();
  useEffect(() => {
    if (popoverRef.current != null) {
      const anchorBox = anchorRef.current!.getBoundingBox("absolute");
      place(popoverRef.current!)
        .withOptions(options)
        .resize(anchorBox, width, height)
        .alignToAnchor(anchorBox, screenSize);
    }
  }, [open, options, width, height, screenSize]);
  const { disabled } = anchor.props;
  const clone = cloneElement(anchor, { ...anchor.props, anchor: anchorRef });
  return (
    <>
      {clone}
      {open && !disabled && (
        <Portal>
          <div {...props} ref={popoverRef} style={{ position: "absolute" }}>
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}
