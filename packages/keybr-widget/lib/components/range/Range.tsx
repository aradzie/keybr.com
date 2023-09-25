import { clsx } from "clsx";
import {
  Component,
  createRef,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { type Focusable } from "../types.ts";
import * as styles from "./Range.module.less";
import { type RangeProps } from "./Range.types.ts";

export class Range extends Component<RangeProps> implements Focusable {
  private readonly element = createRef<HTMLInputElement>();

  blur(): void {
    this.element.current?.blur();
  }

  focus(): void {
    this.element.current?.focus();
  }

  private handleChange = (event: FormEvent): void => {
    const { onChange } = this.props;
    if (onChange != null) {
      onChange(Number((event.target as HTMLInputElement).value));
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
      max,
      min,
      name,
      step,
      tabIndex,
      title,
      value,
      onClick,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    } = this.props;
    return (
      <input
        ref={this.element}
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
