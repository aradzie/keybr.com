import { clsx } from "clsx";
import { type ReactNode, useRef } from "react";
import {
  type ClassName,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../types.ts";
import { type OptionListOption } from "./OptionList.types.ts";
import * as styles from "./OptionListButton.module.less";

export function OptionListButton({
  children,
  className,
  disabled,
  focused,
  open,
  option,
  tabIndex,
  title,
  onClick,
  ...props
}: {
  readonly children: ReactNode;
  readonly className?: ClassName;
  readonly focused: boolean;
  readonly open: boolean;
  readonly option: OptionListOption;
  readonly title?: string;
} & FocusProps &
  MouseProps &
  KeyboardProps): ReactNode {
  const element = useRef<HTMLSpanElement>(null);
  return (
    <span
      {...props}
      ref={element}
      className={clsx(
        styles.root,
        focused && styles.focused,
        disabled && styles.disabled,
        className,
      )}
      tabIndex={disabled ? undefined : tabIndex ?? 0}
      title={title}
    >
      <span className={styles.placeholder} onClick={onClick}>
        <span className={styles.placeholderName}>{option.name}</span>
        <span className={styles.placeholderArrow}>
          {open ? "\u25BC" : "\u25BA"}
        </span>
      </span>
      {children}
    </span>
  );
}
