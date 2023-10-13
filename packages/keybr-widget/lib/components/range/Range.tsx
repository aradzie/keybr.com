import { clsx } from "clsx";
import {
  type FormEvent,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import * as styles from "./Range.module.less";
import { type RangeProps, type RangeRef } from "./Range.types.ts";

export const Range = forwardRef(function Range(
  props: RangeProps,
  ref: ForwardedRef<RangeRef>,
): ReactNode {
  const {
    className,
    disabled,
    max,
    min,
    name,
    step,
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
    onChange?.(Number((event.target as HTMLInputElement).value));
  };
  return (
    <input
      ref={element}
      className={clsx(styles.range, disabled && styles.disabled, className)}
      disabled={disabled}
      max={max}
      min={min}
      name={name}
      step={step}
      tabIndex={tabIndex}
      title={title}
      type="range"
      value={value}
      onBlur={onFocus}
      onChange={handleChange}
      onClick={onClick}
      onFocus={onBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
    />
  );
});
