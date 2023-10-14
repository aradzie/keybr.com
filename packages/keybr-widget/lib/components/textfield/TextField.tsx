import { clsx } from "clsx";
import {
  type FormEvent,
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
  props: TextFieldProps,
  ref: ForwardedRef<TextFieldRef>,
): ReactNode {
  const {
    className,
    disabled,
    maxLength,
    name,
    placeholder,
    tabIndex,
    title,
    type = "text",
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
  const handleChange = (event: FormEvent): void => {
    onChange?.((event.target as HTMLInputElement).value);
  };
  if (type === "textarea") {
    return (
      <textarea
        ref={element as RefObject<HTMLTextAreaElement>}
        className={clsx(
          styles.textField,
          disabled && styles.disabled,
          className,
        )}
        disabled={disabled}
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
        tabIndex={tabIndex}
        title={title}
        value={value}
        onBlur={onBlur}
        onChange={handleChange}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      />
    );
  } else {
    return (
      <input
        ref={element as RefObject<HTMLInputElement>}
        className={clsx(
          styles.textField,
          disabled && styles.disabled,
          className,
        )}
        disabled={disabled}
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
        tabIndex={tabIndex}
        title={title}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={handleChange}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      />
    );
  }
});
