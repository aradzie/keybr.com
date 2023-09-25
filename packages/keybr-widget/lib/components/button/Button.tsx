import { clsx } from "clsx";
import { Component, createRef, type ReactNode, type RefObject } from "react";
import * as iconStyles from "../icon/Icon.module.less";
import * as styles from "./Button.module.less";
import { type ButtonProps } from "./Button.types.ts";

export class Button extends Component<ButtonProps> {
  private readonly element = createRef<HTMLAnchorElement | HTMLButtonElement>();

  focus(): void {
    this.element.current?.focus();
  }

  blur(): void {
    this.element.current?.blur();
  }

  override render(): ReactNode {
    const {
      children,
      className,
      disabled,
      href,
      icon,
      label,
      tabIndex,
      target,
      title,
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    } = this.props;
    if (href != null) {
      if (disabled != null) {
        throw new TypeError();
      }
      return (
        <a
          ref={this.element as RefObject<HTMLAnchorElement>}
          className={clsx(
            styles.button,
            iconStyles.altIcon,
            disabled && styles.disabled,
            className,
          )}
          href={href}
          tabIndex={tabIndex}
          target={target}
          title={title}
          onBlur={onBlur}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
        >
          {icon} {label || children}
        </a>
      );
    } else {
      return (
        <button
          ref={this.element as RefObject<HTMLButtonElement>}
          className={clsx(
            styles.button,
            iconStyles.altIcon,
            disabled && styles.disabled,
            className,
          )}
          disabled={disabled}
          tabIndex={tabIndex}
          title={title}
          onBlur={onBlur}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
        >
          {icon} {label || children}
        </button>
      );
    }
  }
}
