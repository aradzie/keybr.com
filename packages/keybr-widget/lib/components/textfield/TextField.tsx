import { clsx } from "clsx";
import {
  Component,
  createRef,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { type Focusable, type Selectable } from "../types.ts";
import * as styles from "./TextField.module.less";
import { type TextFieldProps } from "./TextField.types.ts";

export class TextField
  extends Component<TextFieldProps>
  implements Focusable, Selectable
{
  private readonly element = createRef<
    HTMLInputElement | HTMLTextAreaElement
  >();

  blur(): void {
    this.element.current?.blur();
  }

  focus(): void {
    this.element.current?.focus();
  }

  select(): void {
    this.element.current?.select();
  }

  private handleChange = (event: FormEvent): void => {
    const { onChange } = this.props;
    if (onChange != null) {
      onChange((event.target as HTMLInputElement).value);
    }
  };

  private handleFocus = (event: FocusEvent): void => {
    const { onFocus } = this.props;
    if (onFocus != null) {
      onFocus(event);
    }
  };

  private handleBlur = (event: FocusEvent): void => {
    const { onBlur } = this.props;
    if (onBlur != null) {
      onBlur(event);
    }
  };

  override render(): ReactNode {
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
      onClick,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    } = this.props;
    if (type === "textarea") {
      return (
        <textarea
          ref={this.element as RefObject<HTMLTextAreaElement>}
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
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onClick={onClick}
          onFocus={this.handleFocus}
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
          ref={this.element as RefObject<HTMLInputElement>}
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
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onClick={onClick}
          onFocus={this.handleFocus}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
        />
      );
    }
  }
}
