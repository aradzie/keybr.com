import {
  CaretMovementStyle,
  CaretShapeStyle,
  type TextDisplaySettings,
} from "@keybr/textinput";
import {
  Component,
  createRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { findCursor } from "./chars.tsx";
import * as styles from "./Cursor.module.less";

type Props = {
  readonly settings: TextDisplaySettings;
  readonly children: ReactNode;
};

export class Cursor extends Component<Props> {
  readonly #containerRef = createRef<HTMLDivElement>();
  readonly #cursorRef = createRef<HTMLSpanElement>();
  #initial = true;
  #animation: Animation | null = null;

  override componentDidMount(): void {
    this.#position();
  }

  override componentDidUpdate(): void {
    this.#position();
  }

  override componentWillUnmount(): void {
    if (this.#animation != null) {
      this.#animation.cancel();
    }
  }

  #position(): void {
    const container = this.#containerRef.current;
    const cursor = this.#cursorRef.current;
    if (container != null && cursor != null) {
      const char = findCursor(container);
      if (char != null) {
        this.#move(cursor, char);
      } else {
        this.#hide(cursor);
      }
    }
  }

  #move(cursor: HTMLElement, char: HTMLElement): void {
    const {
      caretShapeStyle,
      caretMovementStyle,
      language: { direction },
    } = this.props.settings;

    const { style } = cursor;

    const from = window.getComputedStyle(char);
    style.fontFamily = from.fontFamily;
    style.fontSize = from.fontSize;
    style.fontStyle = from.fontStyle;
    style.fontWeight = from.fontWeight;
    style.fontVariant = from.fontVariant;
    style.fontKerning = from.fontKerning;
    style.lineHeight = from.lineHeight;

    const x = char.offsetLeft;
    const y = char.parentElement!.offsetTop;
    const w = char.offsetWidth;
    const h = char.parentElement!.offsetHeight;

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
        switch (direction) {
          case "ltr":
            left = x - 2;
            break;
          case "rtl":
            left = x + w;
            break;
        }
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

    if (this.#initial || caretMovementStyle !== CaretMovementStyle.Smooth) {
      if (this.#animation != null) {
        this.#animation.cancel();
        this.#animation = null;
      }
    } else {
      if (this.#animation != null) {
        this.#animation.cancel();
        this.#animation = null;
      } else {
        this.#animation = cursor.animate(
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
        const clear = () => {
          this.#animation = null;
        };
        this.#animation.onfinish = clear;
        this.#animation.oncancel = clear;
        this.#animation.onremove = clear;
      }
    }

    this.#initial = false;
  }

  #hide(cursor: HTMLElement): void {
    const { style } = cursor;

    cursor.textContent = "";

    style.display = "none";
    style.left = "";
    style.top = "";
    style.width = "";
    style.height = "";

    this.#initial = true;
  }

  override render(): ReactNode {
    return (
      <div ref={this.#containerRef} style={containerStyle}>
        <span
          ref={this.#cursorRef}
          className={cursorClassName(this.props.settings)}
          style={cursorStyle}
        />
        {this.props.children}
      </div>
    );
  }
}

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
};

function cursorClassName({
  caretShapeStyle,
}: {
  readonly caretShapeStyle: CaretShapeStyle;
}): string {
  switch (caretShapeStyle) {
    case CaretShapeStyle.Block:
      return styles.block;
    case CaretShapeStyle.Box:
      return styles.box;
    case CaretShapeStyle.Line:
      return styles.line;
    case CaretShapeStyle.Underline:
      return styles.underline;
  }
}

function wpmToDuration(wpm: number): number {
  return Math.round(1000 / ((wpm * 5) / 60));
}
