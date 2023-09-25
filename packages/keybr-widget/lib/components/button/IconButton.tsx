import { clsx } from "clsx";
import { Component, createRef, type ReactNode, type RefObject } from "react";
import * as styles from "./IconButton.module.less";
import { type IconButtonProps } from "./IconButton.types.ts";

export class IconButton extends Component<IconButtonProps> {
  private readonly element = createRef<HTMLElement>();

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
    if (children != null || label != null) {
      throw new TypeError();
    }
    if (href != null) {
      if (disabled != null) {
        throw new TypeError();
      }
      return (
        <a
          ref={this.element as RefObject<HTMLAnchorElement>}
          className={clsx(
            styles.iconButton,
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
          {icon}
        </a>
      );
    } else {
      return (
        <button
          ref={this.element as RefObject<HTMLButtonElement>}
          className={clsx(
            styles.iconButton,
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
          {icon}
        </button>
      );
    }
  }
}
