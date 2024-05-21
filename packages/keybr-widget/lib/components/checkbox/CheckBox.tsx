import { mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline } from "@mdi/js";
import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import * as styles from "./CheckBox.module.less";
import { type CheckBoxProps, type CheckBoxRef } from "./CheckBox.types.ts";

export const CheckBox = forwardRef(function CheckBox(
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
    ...props
  }: CheckBoxProps,
  ref: ForwardedRef<CheckBoxRef>,
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
        type="checkbox"
        value={value}
        onBlur={onBlur}
        onChange={(event) => {
          const { checked } = event.target as HTMLInputElement;
          onChange?.(checked);
        }}
        onFocus={onFocus}
      />
      <svg className={styles.icon} viewBox="0 0 24 24">
        <path
          d={checked ? mdiCheckboxMarkedOutline : mdiCheckboxBlankOutline}
        />
      </svg>
      <span className={styles.label}>{label || children}</span>
    </label>
  );
});
