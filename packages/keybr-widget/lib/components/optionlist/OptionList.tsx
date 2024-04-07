import { clsx } from "clsx";
import {
  Component,
  createRef,
  type FocusEvent,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { handleHotkeys } from "../../utils/hotkeys.ts";
import * as iconStyles from "../icon/Icon.module.less";
import { type Focusable } from "../types.ts";
import * as styles from "./OptionList.module.less";
import {
  type OptionListOption,
  type OptionListProps,
  type OptionListState,
} from "./OptionList.types.ts";

export class OptionList
  extends Component<OptionListProps, OptionListState>
  implements Focusable
{
  private readonly element = createRef<HTMLElement>();

  override state: OptionListState = {
    focused: false,
    open: false,
    highlightedIndex: 0,
  };

  blur(): void {
    this.element.current?.blur();
  }

  focus(): void {
    this.element.current?.focus();
  }

  private handleFocus = (event: FocusEvent): void => {
    if (!this.props.disabled) {
      this.setState(
        {
          focused: true,
        },
        () => {
          const { onFocus } = this.props;
          if (onFocus != null) {
            onFocus(event);
          }
        },
      );
    }
  };

  private handleBlur = (event: FocusEvent): void => {
    if (!this.props.disabled) {
      this.setState(
        {
          focused: false,
          open: false,
        },
        () => {
          const { onBlur } = this.props;
          if (onBlur != null) {
            onBlur(event);
          }
        },
      );
    }
  };

  private handleOpen = (): void => {
    if (!this.props.disabled) {
      this.setState({
        open: !this.state.open,
      });
    }
  };

  private handleSelect = (): void => {
    if (!this.props.disabled) {
      if (this.state.open) {
        const { options } = this.props;
        const highlightedIndex = Math.min(
          this.state.highlightedIndex,
          options.length - 1,
        );
        this.setState(
          {
            open: false,
          },
          () => {
            const { onSelect } = this.props;
            if (onSelect != null) {
              onSelect(options[highlightedIndex].value);
            }
          },
        );
      }
    }
  };

  private handlePrev = (): void => {
    if (!this.props.disabled) {
      const { options } = this.props;
      let highlightedIndex = Math.min(
        this.state.highlightedIndex,
        options.length - 1,
      );
      highlightedIndex -= 1;
      if (highlightedIndex < 0) {
        highlightedIndex = options.length - 1;
      }
      this.setState(
        {
          highlightedIndex,
        },
        () => {
          if (!this.state.open) {
            const { onSelect } = this.props;
            if (onSelect != null) {
              onSelect(options[highlightedIndex].value);
            }
          }
        },
      );
    }
  };

  private handleNext = (): void => {
    if (!this.props.disabled) {
      const { options } = this.props;
      let highlightedIndex = Math.min(
        this.state.highlightedIndex,
        options.length - 1,
      );
      highlightedIndex += 1;
      if (highlightedIndex >= options.length) {
        highlightedIndex = 0;
      }
      this.setState(
        {
          highlightedIndex,
        },
        () => {
          if (!this.state.open) {
            const { onSelect } = this.props;
            if (onSelect != null) {
              onSelect(options[highlightedIndex].value);
            }
          }
        },
      );
    }
  };

  private handlePlaceholderClick = (event: MouseEvent): void => {
    event.preventDefault();
    if (!this.props.disabled) {
      this.setState({
        open: !this.state.open,
      });
    }
  };

  private handleItemClick = (option: OptionListOption): MouseEventHandler => {
    return (event: MouseEvent): void => {
      event.preventDefault();
      if (!this.props.disabled) {
        this.setState(
          {
            open: false,
          },
          () => {
            const { onSelect } = this.props;
            if (onSelect != null) {
              onSelect(option.value);
            }
          },
        );
      }
    };
  };

  private handleItemMouseOver = (option: OptionListOption) => {
    return (event: MouseEvent): void => {
      event.preventDefault();
      if (!this.props.disabled) {
        this.setState({
          highlightedIndex: this.props.options.indexOf(option),
        });
      }
    };
  };

  override render(): ReactNode {
    const { className, disabled, options, tabIndex, title, value } = this.props;
    const { focused, open, highlightedIndex } = this.state;
    const selectedOption = options.find((option) => option.value === value) ?? {
      value: "",
      name: "-",
    };
    return (
      <span
        ref={this.element}
        className={clsx(
          styles.optionList,
          focused && styles.focused,
          disabled && styles.disabled,
          className,
        )}
        tabIndex={disabled ? undefined : tabIndex || 0}
        title={title}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onKeyDown={handleHotkeys(
          ["Space", this.handleOpen],
          ["Enter", this.handleSelect],
          ["ArrowUp", this.handlePrev],
          ["ArrowDown", this.handleNext],
        )}
      >
        <span
          className={styles.placeholder}
          onClick={this.handlePlaceholderClick}
        >
          <span className={styles.placeholderName}>{selectedOption.name}</span>
          <span className={styles.placeholderArrow}>
            {open ? "\u25BC" : "\u25BA"}
          </span>
        </span>
        {open && (
          <span role="menu" className={styles.list}>
            {options.map((option, index) => (
              <span
                key={index}
                role="menuitem"
                className={clsx(
                  styles.item,
                  iconStyles.altIcon,
                  option === selectedOption && styles.item_selected,
                  index === highlightedIndex && styles.item_highlighted,
                )}
                onMouseOver={this.handleItemMouseOver(option)}
                onClick={this.handleItemClick(option)}
              >
                {option.name}
              </span>
            ))}
          </span>
        )}
      </span>
    );
  }
}
