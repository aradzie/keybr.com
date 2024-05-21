import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";
import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import * as styles from "./RadioBox.module.less";
import { type RadioBoxProps, type RadioBoxRef } from "./RadioBox.types.ts";

export const RadioBox = forwardRef(function RadioBox(
  {
    checked,
    children,
    className,
    disabled,
    label,
    name,
    tabIndex,
    title,
    value,
    onBlur,
    onChange,
    onFocus,
    onSelect,
    ...props
  }: RadioBoxProps,
  ref: ForwardedRef<RadioBoxRef>,
): ReactNode {
  const element = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus() {
      element.current?.focus();
    },
    blur() {
      element.current?.blur();
    },
  }));
  return (
    <label
      {...props}
      className={clsx(styles.root, disabled && styles.disabled, className)}
      title={title}
    >
      <input
        ref={element}
        checked={checked}
        disabled={disabled}
        name={name}
        tabIndex={tabIndex}
        type="radio"
        value={value}
        onBlur={onBlur}
        onChange={(event) => {
          const { checked } = event.target as HTMLInputElement;
          onChange?.(checked);
          if (checked) {
            onSelect?.(value);
          }
        }}
        onFocus={onFocus}
      />
      <svg className={styles.icon} viewBox="0 0 24 24">
        <path d={checked ? mdiRadioboxMarked : mdiRadioboxBlank} />
      </svg>
      <span className={styles.label}>{label || children}</span>
    </label>
  );
});
