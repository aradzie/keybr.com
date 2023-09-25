import { type Char, type LineData } from "@keybr/textinput";
import { type KeyEvent, TextEvents } from "@keybr/textinput-events";
import {
  type TextDisplaySettings,
  textDisplaySettings,
} from "@keybr/textinput-settings";
import { clsx } from "clsx";
import {
  type ComponentType,
  createRef,
  type MouseEvent,
  PureComponent,
  type ReactNode,
} from "react";
import { FormattedMessage } from "react-intl";
import { Cursor } from "./Cursor.tsx";
import * as styles from "./TextArea.module.less";
import { TextLine } from "./TextLine.tsx";

export type TextAreaSize = "X0" | "X1" | "X2" | "X3";

type Props = {
  readonly settings: TextDisplaySettings;
  readonly lines: readonly LineData[];
  readonly wrap?: boolean;
  readonly size?: TextAreaSize;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly onKeyDown?: (event: KeyEvent) => void;
  readonly onKeyUp?: (event: KeyEvent) => void;
  readonly onInput?: (codePoint: number, timeStamp: number) => void;
  readonly lineTemplate?: ComponentType<any>;
};

type State = {
  readonly focus: boolean;
};

export class TextArea extends PureComponent<Props, State> {
  private textEvents = createRef<TextEvents>();

  override state: State = {
    focus: false,
  };

  isFocused(): boolean {
    return this.textEvents.current?.isFocused() ?? false;
  }

  focus(): void {
    this.textEvents.current?.focus();
  }

  blur(): void {
    this.textEvents.current?.blur();
  }

  private handleFocus = (): void => {
    this.setState({ focus: true }, () => {
      this.props.onFocus?.();
    });
  };

  private handleBlur = (): void => {
    this.setState({ focus: false }, () => {
      this.props.onBlur?.();
    });
  };

  private handleMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
    this.focus();
  };

  private handleMouseUp = (event: MouseEvent): void => {
    event.preventDefault();
    this.focus();
  };

  private handleClick = (event: MouseEvent): void => {
    event.preventDefault();
    this.focus();
  };

  private handleKeyDown = (event: KeyEvent): void => {
    this.props.onKeyDown?.(event);
  };

  private handleKeyUp = (event: KeyEvent): void => {
    this.props.onKeyUp?.(event);
  };

  private handleInput = (codePoint: number, timeStamp: number) => {
    this.props.onInput?.(codePoint, timeStamp);
  };

  override render(): ReactNode {
    const {
      settings,
      lines,
      wrap = true,
      size = "X0",
      lineTemplate: Line,
    } = this.props;
    const { focus } = this.state;
    const children = lines.map((lineData: LineData): ReactNode => {
      const { chars, key, ...rest } = lineData;
      const textLine = (
        <TextLine key={key} settings={settings} chars={chars} wrap={wrap} />
      );
      return Line != null ? (
        <Line key={`${key}-line`} {...rest}>
          {textLine}
        </Line>
      ) : (
        textLine
      );
    });
    return (
      <div
        className={styles.textArea}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onClick={this.handleClick}
      >
        <TextEvents
          ref={this.textEvents}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          onInput={this.handleInput}
        />
        <div
          className={clsx(
            styles.text,
            focus ? styles.text_focus : styles.text_blur,
            sizeStyleName(size),
          )}
        >
          {focus ? <Cursor settings={settings}>{children}</Cursor> : children}
        </div>
        {focus || (
          <div className={styles.label}>
            <FormattedMessage
              id="practice.focusText"
              description="Freeform text."
              defaultMessage="Click to activate..."
            />
          </div>
        )}
      </div>
    );
  }
}

export function StaticText({
  settings = textDisplaySettings,
  chars,
  cursor = false,
  wrap = true,
  size = "X0",
}: {
  readonly settings?: TextDisplaySettings;
  readonly chars: readonly Char[];
  readonly cursor?: boolean;
  readonly wrap?: boolean;
  readonly size?: TextAreaSize;
}): ReactNode {
  return (
    <div className={styles.staticText}>
      <div
        className={clsx(styles.text, styles.text_focus, sizeStyleName(size))}
      >
        {cursor ? (
          <Cursor settings={settings}>
            <TextLine settings={settings} chars={chars} wrap={wrap} />
          </Cursor>
        ) : (
          <TextLine settings={settings} chars={chars} wrap={wrap} />
        )}
      </div>
    </div>
  );
}

function sizeStyleName(size: TextAreaSize): string {
  switch (size) {
    case "X0":
      return styles.size_X0;
    case "X1":
      return styles.size_X1;
    case "X2":
      return styles.size_X2;
    case "X3":
      return styles.size_X3;
  }
}
