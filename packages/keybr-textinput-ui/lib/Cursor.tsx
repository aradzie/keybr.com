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
import { getCursorStyle } from "./styles.ts";

export class Cursor extends Component<{
  readonly settings: TextDisplaySettings;
  readonly children: ReactNode;
}> {
  readonly #containerRef = createRef<HTMLDivElement>();
  readonly #cursorRef = createRef<HTMLSpanElement>();
  #initial = true;
  #animation: Animation | null = null;

  override componentDidMount() {
    this.#position();
  }

  override componentDidUpdate() {
    this.#position();
  }

  override componentWillUnmount() {
    if (this.#animation != null) {
      this.#animation.cancel();
    }
  }

  #position() {
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

  #move(cursor: HTMLElement, char: HTMLElement) {
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

  #hide(cursor: HTMLElement) {
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
          style={{
            ...cursorStyle,
            ...getCursorStyle(this.props.settings.caretShapeStyle),
          }}
        />
        {this.props.children}
      </div>
    );
  }
}

const containerStyle = {
  display: "block",
  position: "relative",
} satisfies CSSProperties;

const cursorStyle = {
  display: "block",
  position: "absolute",
  left: 0,
  top: 0,
  width: 0,
  height: 0,
} satisfies CSSProperties;

function wpmToDuration(wpm: number): number {
  return Math.round(1000 / ((wpm * 5) / 60));
}
