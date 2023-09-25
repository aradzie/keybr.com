import {
  CaretMovementStyle,
  CaretShapeStyle,
  type TextDisplaySettings,
} from "@keybr/textinput-settings";
import { clsx } from "clsx";
import {
  Component,
  createRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "./chars.tsx";
import * as styles from "./Cursor.module.less";

const containerStyle: CSSProperties = {
  display: "block",
  position: "relative",
};

const cursorStyle: CSSProperties = {
  display: "block",
  position: "absolute",
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  lineHeight: 1,
};

const cursorItemSelector = `.${cn.charsCursor}`;

type Props = {
  readonly settings: TextDisplaySettings;
  readonly children: ReactNode;
};

export class Cursor extends Component<Props> {
  private readonly containerRef = createRef<HTMLDivElement>();
  private readonly cursorRef = createRef<HTMLSpanElement>();
  private initial = true;
  private animation: Animation | null = null;

  override componentDidMount(): void {
    this.position(true);
  }

  override componentDidUpdate(): void {
    this.position(false);
  }

  override componentWillUnmount(): void {
    const { animation } = this;
    if (animation != null) {
      animation.cancel();
    }
  }

  position(initial: boolean): void {
    const container = this.containerRef.current;
    const cursor = this.cursorRef.current;
    if (container != null && cursor != null) {
      const char = container.querySelector<HTMLElement>(cursorItemSelector);
      if (char != null) {
        this.move(cursor, char);
      } else {
        this.hide(cursor);
      }
    }
  }

  private move(cursor: HTMLElement, char: HTMLElement): void {
    const { caretShapeStyle, caretMovementStyle } = this.props.settings;

    const { style } = cursor;

    const x = char.offsetLeft;
    const y = char.offsetTop;
    const w = char.offsetWidth;
    const h = char.offsetHeight;

    let left: number;
    let top: number;

    switch (caretShapeStyle) {
      case CaretShapeStyle.Block:
        cursor.textContent = char.textContent;
        style.display = "block";
        style.borderWidth = "";
        style.width = "";
        style.height = "";
        left = x;
        top = y;
        break;

      case CaretShapeStyle.Box:
        cursor.textContent = "";
        style.display = "block";
        style.borderWidth = "1px";
        style.width = `${w + 4}px`;
        style.height = `${h + 4}px`;
        left = x - 2;
        top = y - 2;
        break;

      case CaretShapeStyle.Line:
        cursor.textContent = "";
        style.display = "block";
        style.borderWidth = "";
        style.width = "2px";
        style.height = `${h}px`;
        left = x - 2;
        top = y;
        break;

      case CaretShapeStyle.Underline:
        cursor.textContent = "";
        style.display = "block";
        style.borderWidth = "";
        style.width = `${w}px`;
        style.height = "2px";
        left = x;
        top = y + h - 2;
        break;
    }

    const fromLeft = cursor.offsetLeft;
    const fromTop = cursor.offsetTop;

    style.left = `${left}px`;
    style.top = `${top}px`;

    let { animation } = this;

    if (this.initial || caretMovementStyle !== CaretMovementStyle.Smooth) {
      if (animation != null) {
        animation.cancel();
        animation = null;
      }
    } else {
      if (animation != null) {
        animation.cancel();
        animation = null;
      } else {
        animation = cursor.animate(
          [
            {
              left: `${fromLeft}px`,
              top: `${fromTop}px`,
            },
            {
              left: `${left}px`,
              top: `${top}px`,
            },
          ],
          {
            duration: wpmToDuration(120),
            iterations: 1,
            easing: "linear",
          },
        );
        const clear = (): void => {
          this.animation = null;
        };
        animation.onfinish = clear;
        animation.oncancel = clear;
        animation.onremove = clear;
      }
    }

    this.animation = animation;

    this.initial = false;
  }

  private hide(cursor: HTMLElement): void {
    const { style } = cursor;

    cursor.textContent = "";

    style.display = "none";
    style.left = "";
    style.top = "";
    style.width = "";
    style.height = "";

    this.initial = true;
  }

  override render(): ReactNode {
    const { settings } = this.props;
    return (
      <div ref={this.containerRef} style={containerStyle}>
        <span
          ref={this.cursorRef}
          className={cursorClassName(settings)}
          style={cursorStyle}
        />
        {this.props.children}
      </div>
    );
  }
}

const cnBlock = clsx(cn.chars, styles.cursor_block);
const cnBox = clsx(cn.chars, styles.cursor_box);
const cnLine = clsx(cn.chars, styles.cursor_line);
const cnUnderline = clsx(cn.chars, styles.cursor_underline);

function cursorClassName({
  caretShapeStyle,
}: {
  readonly caretShapeStyle: CaretShapeStyle;
}): string {
  switch (caretShapeStyle) {
    case CaretShapeStyle.Block:
      return cnBlock;
    case CaretShapeStyle.Box:
      return cnBox;
    case CaretShapeStyle.Line:
      return cnLine;
    case CaretShapeStyle.Underline:
      return cnUnderline;
  }
}

function wpmToDuration(wpm: number): number {
  return Math.round(1000 / ((wpm * 5) / 60));
}
