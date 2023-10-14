import { mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline } from "@mdi/js";
import { clsx } from "clsx";
import {
  type FormEvent,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import * as styles from "./CheckBox.module.less";
import { type CheckBoxProps, type CheckBoxRef } from "./CheckBox.types.ts";

export const CheckBox = forwardRef(function CheckBox(
  props: CheckBoxProps,
  ref: ForwardedRef<CheckBoxRef>,
): ReactNode {
  const {
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
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
  } = props;
  const element = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus() {
      element.current?.focus();
    },
    blur() {
      element.current?.blur();
    },
  }));
  const handleChange = (event: FormEvent): void => {
    const { checked } = event.target as HTMLInputElement;
    onChange?.(checked);
  };
  return (
    <label
      className={clsx(styles.checkBox, disabled && styles.disabled, className)}
      title={title}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
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
        onChange={handleChange}
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
