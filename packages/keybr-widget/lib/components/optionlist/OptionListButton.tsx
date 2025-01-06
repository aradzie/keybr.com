import { clsx } from "clsx";
import { type ReactNode, useImperativeHandle, useRef } from "react";
import { sizeClassName, type SizeName } from "../../styles/index.ts";
import { getBoundingBox } from "../../utils/index.ts";
import {
  type AnchorProps,
  type FocusProps,
  type KeyboardProps,
  type MouseProps,
} from "../types.ts";
import * as styles from "./OptionListButton.module.less";

export type OptionListButtonProps = {
  readonly focused: boolean;
  readonly label: ReactNode;
  readonly open?: boolean;
  readonly size?: SizeName;
  readonly title?: string;
} & FocusProps &
  MouseProps &
  KeyboardProps &
  AnchorProps;

export function OptionListButton({
  anchor,
  disabled,
  focused,
  label,
  open,
  size,
  tabIndex,
  title,
  ...props
}: OptionListButtonProps): ReactNode {
  const element = useRef<HTMLButtonElement>(null);
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
        focused && styles.focused,
        disabled && styles.disabled,
        sizeClassName(size),
      )}
      disabled={disabled}
      tabIndex={tabIndex}
      title={title}
    >
      <span className={styles.placeholder}>
        <span className={styles.placeholderName}>{label}</span>
        <span className={styles.placeholderArrow}>
          {open ? "\u25BC" : "\u25BA"}
        </span>
      </span>
    </button>
  );
}
