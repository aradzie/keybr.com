import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import * as styles from "./Range.module.less";
import { type RangeProps, type RangeRef } from "./Range.types.ts";

export const Range = forwardRef(function Range(
  {
    className,
    disabled,
    max,
    min,
    name,
    step,
    tabIndex,
    title,
    value,
    onChange,
    ...props
  }: RangeProps,
  ref: ForwardedRef<RangeRef>,
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
    <input
      {...props}
      ref={element}
      className={clsx(styles.root, disabled && styles.disabled, className)}
      disabled={disabled}
      max={max}
      min={min}
      name={name}
      step={step}
      tabIndex={tabIndex}
      title={title}
      type="range"
      value={value}
      onChange={(event) => {
        onChange?.(Number((event.target as HTMLInputElement).value));
      }}
    />
  );
});
