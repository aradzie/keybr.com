import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { sizeClassName } from "../../styles/index.ts";
import { getBoundingBox } from "../../utils/index.ts";
import * as iconStyles from "../icon/Icon.module.less";
import * as styles from "./Button.module.less";
import { type ButtonProps, type ButtonRef } from "./Button.types.ts";

export const Button = forwardRef(function Button(
  {
    anchor,
    children,
    disabled,
    icon,
    label,
    size,
    tabIndex,
    title,
    ...props
  }: ButtonProps,
  ref: ForwardedRef<ButtonRef>,
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
  return (
    <button
      {...props}
      ref={element}
      className={clsx(
        styles.root,
        iconStyles.altIcon,
        disabled && styles.disabled,
        sizeClassName(size),
      )}
      disabled={disabled}
      tabIndex={tabIndex}
      title={title}
    >
      {icon} {label || children}
    </button>
  );
});
