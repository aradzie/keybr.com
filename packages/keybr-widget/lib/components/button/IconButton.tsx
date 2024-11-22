import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { getBoundingBox } from "../../utils/index.ts";
import * as styles from "./IconButton.module.less";
import {
  type IconButtonProps,
  type IconButtonRef,
} from "./IconButton.types.ts";

export const IconButton = forwardRef(function IconButton(
  {
    anchor,
    children,
    disabled,
    icon,
    label,
    tabIndex,
    title,
    ...props
  }: IconButtonProps,
  ref: ForwardedRef<IconButtonRef>,
): ReactNode {
  const element = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => ({
    focus() {
      element.current?.focus();
    },
    blur() {
      element.current?.blur();
    },
  }));
  useImperativeHandle(anchor, () => ({
    getBoundingBox() {
      return getBoundingBox(element.current!);
    },
  }));
  if (children != null || label != null) {
    throw new TypeError();
  }
  return (
    <button
      {...props}
      ref={element}
      className={clsx(styles.root, disabled && styles.disabled)}
      disabled={disabled}
      tabIndex={tabIndex}
      title={title}
    >
      {icon}
    </button>
  );
});
