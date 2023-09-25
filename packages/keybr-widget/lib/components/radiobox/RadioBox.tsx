import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";
import { clsx } from "clsx";
import {
  Component,
  createRef,
  type FocusEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { type Focusable } from "../types.ts";
import * as styles from "./RadioBox.module.less";
import { type RadioBoxProps } from "./RadioBox.types.ts";

export class RadioBox extends Component<RadioBoxProps> implements Focusable {
  private readonly element = createRef<HTMLInputElement>();

  blur(): void {
    this.element.current?.blur();
  }

  focus(): void {
    this.element.current?.focus();
  }

  private handleClick = (event: MouseEvent): void => {
    const { onClick } = this.props;
    if (onClick != null) {
      onClick(event);
    }
  };

  private handleChange = (event: FormEvent): void => {
    const { checked } = event.target as HTMLInputElement;
    const { onChange } = this.props;
    if (onChange != null) {
      onChange(checked);
    }
    if (checked) {
      const { onSelect } = this.props;
      if (onSelect != null) {
        onSelect(this.props.value);
      }
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
      checked,
      children,
      className,
      disabled,
      label,
      name,
      tabIndex,
      title,
      value,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    } = this.props;
    return (
      <label
        className={clsx(
          styles.radioBox,
          disabled && styles.disabled,
          className,
        )}
        title={title}
        onClick={this.handleClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      >
        <input
          ref={this.element}
          checked={checked}
          disabled={disabled}
          name={name}
          tabIndex={tabIndex}
          type="radio"
          value={value}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
        />
        <svg className={styles.icon} viewBox="0 0 24 24">
          <path d={checked ? mdiRadioboxMarked : mdiRadioboxBlank} />
        </svg>
        <span className={styles.label}>{label || children}</span>
      </label>
    );
  }
}
