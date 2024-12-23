import { clsx } from "clsx";
import { type ReactNode, useImperativeHandle, useRef } from "react";
import { sizeClassName } from "../../styles/index.ts";
import * as styles from "./Range.module.less";
import { type RangeProps } from "./Range.types.ts";

export function Range({
  disabled,
  max,
  min,
  name,
  ref,
  size,
  step,
  tabIndex,
  title,
  value,
  onChange,
  ...props
}: RangeProps): ReactNode {
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
      className={clsx(
        styles.root,
        disabled && styles.disabled,
        sizeClassName(size),
      )}
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
}
