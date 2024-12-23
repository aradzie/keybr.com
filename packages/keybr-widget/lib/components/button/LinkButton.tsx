import { clsx } from "clsx";
import { type ReactNode, useImperativeHandle, useRef } from "react";
import { getBoundingBox } from "../../utils/index.ts";
import * as styles from "./LinkButton.module.less";
import { type LinkButtonProps } from "./LinkButton.types.ts";

export function LinkButton({
  anchor,
  children,
  className,
  disabled,
  label,
  ref,
  tabIndex,
  title,
  onClick,
  ...props
}: LinkButtonProps): ReactNode {
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
}
