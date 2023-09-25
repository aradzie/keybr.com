import { clsx } from "clsx";
import {
  Children,
  Component,
  type FocusEvent,
  type MouseEvent,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type RefCallback,
} from "react";
import { handleHotkeys } from "../../utils/hotkeys.ts";
import * as styles from "./TabList.module.less";
import {
  type TabListProps,
  type TabListState,
  type TabProps,
} from "./TabList.types.ts";

export class TabList extends Component<TabListProps, TabListState> {
  override state: TabListState = {
    focused: false,
  };

  override render(): ReactNode {
    const { className, disabled, children, selectedIndex = 0 } = this.props;
    const tabs = Children.toArray(children) as ReactElement<TabProps>[];
    const selectedTab = tabs[selectedIndex];
    const items: ReactNode[] = [];
    items.push(
      <span
        key="spacer-first"
        className={clsx(styles.spacer, styles.spacer_first)}
      />,
    );
    tabs.forEach((tab, index) => {
      const selected = tab === selectedTab;
      if (index > 0) {
        items.push(
          <span
            key={`spacer-${index}`}
            className={clsx(styles.spacer, styles.spacer_middle)}
          />,
        );
      }
      const selectPrev = () => {
        this.select(index - 1);
      };
      const selectNext = () => {
        this.select(index + 1);
      };
      items.push(
        <span
          key={`item-${index}`}
          ref={this.ref(index)}
          className={clsx(
            styles.item,
            selected ? styles.item_active : styles.item_inactive,
            disabled && styles.disabled,
          )}
          tabIndex={!disabled && selected ? 0 : undefined}
          title={tab.props.title}
          onBlur={this.handleBlur}
          onClick={this.handleClick(index)}
          onFocus={this.handleFocus}
          onKeyDown={handleHotkeys(
            ["ArrowLeft", selectPrev],
            ["ArrowUp", selectPrev],
            ["ArrowRight", selectNext],
            ["ArrowDown", selectNext],
          )}
        >
          {tab.props.label}
        </span>,
      );
    });
    items.push(
      <span
        key="spacer-last"
        className={clsx(styles.spacer, styles.spacer_last)}
      />,
    );
    return (
      <div className={clsx(styles.tabList, className)}>
        <div className={styles.menu}>{items}</div>
        <div className={styles.body}>{selectedTab.props.children}</div>
      </div>
    );
  }

  private ref = (index: number): RefCallback<HTMLElement> => {
    return (element: HTMLElement | null): void => {
      const {
        props: { disabled, selectedIndex = 0 },
        state: { focused },
      } = this;
      if (element != null) {
        if (!disabled && focused && index === selectedIndex) {
          element.focus();
        }
      }
    };
  };

  private select = (selectedIndex: number): void => {
    if (!this.props.disabled) {
      const { onSelect } = this.props;
      if (onSelect != null) {
        const tabs = Children.toArray(
          this.props.children,
        ) as ReactElement<TabProps>[];
        if (selectedIndex < 0) {
          selectedIndex = tabs.length - 1;
        } else if (selectedIndex >= tabs.length) {
          selectedIndex = 0;
        }
        onSelect(selectedIndex);
      }
    }
  };

  private handleFocus = (event: FocusEvent): void => {
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
  };

  private handleBlur = (event: FocusEvent): void => {
    this.setState(
      {
        focused: false,
      },
      () => {
        const { onBlur } = this.props;
        if (onBlur != null) {
          onBlur(event);
        }
      },
    );
  };

  private handleClick = (index: number): MouseEventHandler => {
    return (event: MouseEvent): void => {
      event.preventDefault();
      this.select(index);
    };
  };
}

export class Tab extends Component<TabProps> {
  override render(): null {
    return null;
  }
}
