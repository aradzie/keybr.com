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
import * as iconStyles from "../icon/Icon.module.less";
import * as styles from "./Button.module.less";
import { type ButtonProps, type ButtonRef } from "./Button.types.ts";

export const Button = forwardRef(function Button(
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
  }: ButtonProps,
  ref: ForwardedRef<ButtonRef>,
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
  if (href != null) {
    if (disabled != null) {
      throw new TypeError();
    }
    return (
      <a
        {...props}
        ref={element as RefObject<HTMLAnchorElement>}
        className={clsx(
          styles.button,
          iconStyles.altIcon,
          disabled && styles.disabled,
          className,
        )}
        href={href}
        tabIndex={tabIndex}
        target={target}
        title={title}
      >
        {icon} {label || children}
      </a>
    );
  } else {
    return (
      <button
        {...props}
        ref={element as RefObject<HTMLButtonElement>}
        className={clsx(
          styles.button,
          iconStyles.altIcon,
          disabled && styles.disabled,
          className,
        )}
        disabled={disabled}
        tabIndex={tabIndex}
        title={title}
      >
        {icon} {label || children}
      </button>
    );
  }
});
