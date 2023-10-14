import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  type RefObject,
  useImperativeHandle,
  useRef,
} from "react";
import * as styles from "./IconButton.module.less";
import {
  type IconButtonProps,
  type IconButtonRef,
} from "./IconButton.types.ts";

export const IconButton = forwardRef(function IconButton(
  props: IconButtonProps,
  ref: ForwardedRef<IconButtonRef>,
): ReactNode {
  const {
    children,
    className,
    disabled,
    href,
    icon,
    label,
    tabIndex,
    target,
    title,
    onBlur,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
  } = props;
  const element = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  useImperativeHandle(ref, () => ({
    focus() {
      element.current?.focus();
    },
    blur() {
      element.current?.blur();
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
        ref={element as RefObject<HTMLAnchorElement>}
        className={clsx(
          styles.iconButton,
          disabled && styles.disabled,
          className,
        )}
        href={href}
        tabIndex={tabIndex}
        target={target}
        title={title}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      >
        {icon}
      </a>
    );
  } else {
    return (
      <button
        ref={element as RefObject<HTMLButtonElement>}
        className={clsx(
          styles.iconButton,
          disabled && styles.disabled,
          className,
        )}
        disabled={disabled}
        tabIndex={tabIndex}
        title={title}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      >
        {icon}
      </button>
    );
  }
});
