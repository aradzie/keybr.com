import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  type RefObject,
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
    className,
    disabled,
    href,
    icon,
    label,
    tabIndex,
    target,
    title,
    ...props
  }: IconButtonProps,
  ref: ForwardedRef<IconButtonRef>,
): ReactNode {
  const element = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  useImperativeHandle(ref, () => ({
    focus() {
      element.current?.focus();
    },
    blur() {
      element.current?.blur();
    },
  }));
  useImperativeHandle(anchor, () => ({
    getBoundingBox(position) {
      return getBoundingBox(element.current!, position);
    },
  }));
  if (children != null || label != null) {
    throw new TypeError();
  }
  if (href != null) {
    if (disabled != null) {
      throw new TypeError();
    }
    return (
      <a
        {...props}
        ref={element as RefObject<HTMLAnchorElement>}
        className={clsx(styles.root, disabled && styles.disabled, className)}
        href={href}
        tabIndex={tabIndex}
        target={target}
        title={title}
      >
        {icon}
      </a>
    );
  } else {
    return (
      <button
        {...props}
        ref={element as RefObject<HTMLButtonElement>}
        className={clsx(styles.root, disabled && styles.disabled, className)}
        disabled={disabled}
        tabIndex={tabIndex}
        title={title}
      >
        {icon}
      </button>
    );
  }
});
