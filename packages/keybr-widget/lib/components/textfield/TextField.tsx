import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  type RefObject,
  useImperativeHandle,
  useRef,
} from "react";
import * as styles from "./TextField.module.less";
import { type TextFieldProps, type TextFieldRef } from "./TextField.types.ts";

export const TextField = forwardRef(function TextField(
  {
    className,
    disabled,
    maxLength,
    name,
    placeholder,
    tabIndex,
    title,
    type = "text",
    value,
    onChange,
    ...props
  }: TextFieldProps,
  ref: ForwardedRef<TextFieldRef>,
): ReactNode {
  const element = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus() {
      element.current?.focus();
    },
    blur() {
      element.current?.blur();
    },
    select() {
      element.current?.select();
    },
  }));
  if (type === "textarea") {
    return (
      <textarea
        {...props}
        ref={element as RefObject<HTMLTextAreaElement>}
        className={clsx(styles.root, disabled && styles.disabled, className)}
        disabled={disabled}
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
        tabIndex={tabIndex}
        title={title}
        value={value}
        onChange={(event) => {
          onChange?.((event.target as HTMLTextAreaElement).value);
        }}
      />
    );
  } else {
    return (
      <input
        ref={element as RefObject<HTMLInputElement>}
        className={clsx(styles.root, disabled && styles.disabled, className)}
        disabled={disabled}
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
        tabIndex={tabIndex}
        title={title}
        type={type}
        value={value}
        onChange={(event) => {
          onChange?.((event.target as HTMLInputElement).value);
        }}
        {...props}
      />
    );
  }
});
