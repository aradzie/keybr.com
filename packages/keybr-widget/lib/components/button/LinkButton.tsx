import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { getBoundingBox } from "../../utils/index.ts";
import * as styles from "./LinkButton.module.less";
import {
  type LinkButtonProps,
  type LinkButtonRef,
} from "./LinkButton.types.ts";

export const LinkButton = forwardRef(function LinkButton(
  {
    anchor,
    children,
    className,
    disabled,
    label,
    tabIndex,
    title,
    onClick,
    ...props
  }: LinkButtonProps,
  ref: ForwardedRef<LinkButtonRef>,
): ReactNode {
  const element = useRef<HTMLAnchorElement>(null);
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
    <a
      {...props}
      ref={element}
      href="#"
      className={clsx(styles.root, disabled && styles.disabled, className)}
      tabIndex={tabIndex}
      title={title}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {label || children}
    </a>
  );
});
