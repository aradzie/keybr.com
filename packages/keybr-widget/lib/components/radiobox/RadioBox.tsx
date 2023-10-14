import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";
import { clsx } from "clsx";
import {
  type FormEvent,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import * as styles from "./RadioBox.module.less";
import { type RadioBoxProps, type RadioBoxRef } from "./RadioBox.types.ts";

export const RadioBox = forwardRef(function RadioBox(
  props: RadioBoxProps,
  ref: ForwardedRef<RadioBoxRef>,
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
    onSelect,
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
    if (checked) {
      onSelect?.(value);
    }
  };
  return (
    <label
      className={clsx(styles.radioBox, disabled && styles.disabled, className)}
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
        type="radio"
        value={value}
        onBlur={onBlur}
        onChange={handleChange}
        onFocus={onFocus}
      />
      <svg className={styles.icon} viewBox="0 0 24 24">
        <path d={checked ? mdiRadioboxMarked : mdiRadioboxBlank} />
      </svg>
      <span className={styles.label}>{label || children}</span>
    </label>
  );
});
