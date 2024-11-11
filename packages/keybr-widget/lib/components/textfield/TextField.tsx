import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  type RefObject,
  useImperativeHandle,
  useRef,
} from "react";
import { sizeClassName } from "../../styles/index.ts";
import * as styles from "./TextField.module.less";
import { type TextFieldProps, type TextFieldRef } from "./TextField.types.ts";

export const TextField = forwardRef(function TextField(
  {
    disabled,
    maxLength,
    name,
    placeholder,
    size,
    tabIndex,
    title,
    type = "text",
    value,
    onChange,
    onInput,
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
        className={clsx(
          styles.root,
          disabled && styles.disabled,
          sizeClassName(size),
        )}
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
        onInput={({ nativeEvent }) => {
          onInput?.(nativeEvent as InputEvent);
        }}
      />
    );
  } else {
    return (
      <input
        {...props}
        ref={element as RefObject<HTMLInputElement>}
        className={clsx(
          styles.root,
          disabled && styles.disabled,
          sizeClassName(size),
        )}
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
        onInput={({ nativeEvent }) => {
          onInput?.(nativeEvent as InputEvent);
        }}
      />
    );
  }
});
