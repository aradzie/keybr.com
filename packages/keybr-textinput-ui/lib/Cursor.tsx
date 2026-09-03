import {
  CaretMovementStyle,
  CaretShapeStyle,
  TapeModeStyle,
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
import { computeCaretLeft, computeTapeScroll } from "./tape.ts";

const TAPE_SCROLL_PROPERTY = "--tape-scroll";

export class Cursor extends Component<{
  readonly settings: TextDisplaySettings;
  readonly children: ReactNode;
}> {
  readonly #containerRef = createRef<HTMLDivElement>();
  readonly #cursorRef = createRef<HTMLSpanElement>();
  #initial = true;
  #animation: Animation | null = null;
  #scroll = 0;

  override componentDidMount() {
    registerTapeScrollProperty();
    this.#position();
  }

  override componentDidUpdate() {
    this.#position();
  }

  override componentWillUnmount() {
    this.#animation?.cancel();
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
      tapeModeStyle,
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

    const container = this.#containerRef.current!;
    const isTape = tapeModeStyle !== TapeModeStyle.Off;
    const smooth =
      !this.#initial && caretMovementStyle === CaretMovementStyle.Smooth;

    let caretX: number;
    if (isTape) {
      // The caret rides on the text at the cursor char position, which is
      // the container center in letter mode and inside the centered word
      // in word mode.
      caretX = x - this.#scrollTo({ container, char, x, w, smooth });
    } else {
      this.#resetTape(container);
      caretX = x;
    }

    let left: number;
    let top: number;

    switch (caretShapeStyle) {
      case CaretShapeStyle.Block:
        cursor.textContent = char.textContent;
        style.display = "block";
        style.borderWidth = "";
        style.width = "";
        style.height = "";
        left = computeCaretLeft(caretShapeStyle, direction, caretX, w);
        top = y;
        break;

      case CaretShapeStyle.Box:
        cursor.textContent = "";
        style.display = "block";
        style.borderWidth = "1px";
        style.width = `${w + 4}px`;
        style.height = `${h + 4}px`;
        left = computeCaretLeft(caretShapeStyle, direction, caretX, w);
        top = y - 2;
        break;

      case CaretShapeStyle.Line:
        cursor.textContent = "";
        style.display = "block";
        style.borderWidth = "";
        style.width = "2px";
        style.height = `${h}px`;
        left = computeCaretLeft(caretShapeStyle, direction, caretX, w);
        top = y;
        break;

      case CaretShapeStyle.Underline:
        cursor.textContent = "";
        style.display = "block";
        style.borderWidth = "";
        style.width = `${w}px`;
        style.height = "2px";
        left = computeCaretLeft(caretShapeStyle, direction, caretX, w);
        top = y + h - 2;
        break;
    }

    if (isTape) {
      style.left = `${left}px`;
      style.top = `${top}px`;
    } else {
      this.#resetTape(container);
      // Read the mid-flight position while the old animation is still
      // attached, because cancelling it reverts the element to its static style.
      const fromLeft = cursor.offsetLeft;
      const fromTop = cursor.offsetTop;
      style.left = `${left}px`;
      style.top = `${top}px`;
      this.#animate(
        cursor,
        { left: `${fromLeft}px`, top: `${fromTop}px` },
        { left: `${left}px`, top: `${top}px` },
        smooth,
      );
    }

    this.#initial = false;
  }

  #animate(
    element: HTMLElement,
    from: Record<string, string>,
    to: Record<string, string>,
    smooth: boolean,
  ): void {
    if (this.#animation != null) {
      this.#animation.cancel();
      this.#animation = null;
    }
    if (!smooth) {
      return;
    }
    const animation = element.animate([from, to], {
      duration: wpmToDuration(120),
      iterations: 1,
      easing: "linear",
    });
    const clear = () => {
      // Ignore stale events from an already replaced animation.
      if (this.#animation === animation) {
        this.#animation = null;
      }
    };
    animation.onfinish = clear;
    animation.oncancel = clear;
    animation.onremove = clear;
    this.#animation = animation;
  }

  #scrollTo({
    container,
    char,
    x,
    w,
    smooth,
  }: {
    readonly container: HTMLElement;
    readonly char: HTMLElement;
    readonly x: number;
    readonly w: number;
    readonly smooth: boolean;
  }): number {
    const { tapeModeStyle } = this.props.settings;
    const word = char.parentElement;
    const scroll = computeTapeScroll({
      tapeModeStyle,
      charX: x,
      charWidth: w,
      wordX: word != null ? word.offsetLeft : x,
      wordWidth: word != null ? word.offsetWidth : w,
      containerWidth: container.clientWidth,
    });
    // Read the mid-flight value while the old animation is still attached.
    const fromScroll = this.#readScroll(container);
    container.style.setProperty(TAPE_SCROLL_PROPERTY, `${scroll}px`);
    this.#animate(
      container,
      { [TAPE_SCROLL_PROPERTY]: `${fromScroll}px` },
      { [TAPE_SCROLL_PROPERTY]: `${scroll}px` },
      // Skip the animation for a sub-pixel move.
      smooth && Math.abs(scroll - fromScroll) >= 0.5,
    );
    this.#scroll = scroll;
    return scroll;
  }

  #readScroll(container: HTMLElement): number {
    const value = window
      .getComputedStyle(container)
      .getPropertyValue(TAPE_SCROLL_PROPERTY);
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : this.#scroll;
  }

  #resetTape(container: HTMLElement) {
    if (this.#scroll !== 0) {
      container.style.removeProperty(TAPE_SCROLL_PROPERTY);
      this.#scroll = 0;
    }
  }

  #hide(cursor: HTMLElement) {
    const { style } = cursor;

    cursor.textContent = "";

    style.display = "none";
    style.left = "";
    style.top = "";
    style.width = "";
    style.height = "";

    const container = this.#containerRef.current;
    if (container != null) {
      if (this.#animation != null) {
        this.#animation.cancel();
        this.#animation = null;
      }
      this.#resetTape(container);
    }
    this.#initial = true;
  }

  override render(): ReactNode {
    const tape = this.props.settings.tapeModeStyle !== TapeModeStyle.Off;
    return (
      <div
        ref={this.#containerRef}
        data-tape={tape ? "" : undefined}
        style={tape ? tapeContainerStyle : containerStyle}
      >
        <span
          ref={this.#cursorRef}
          style={{
            ...cursorStyle,
            ...getCursorStyle(this.props.settings.caretShapeStyle),
          }}
        />
        {tape ? (
          <div style={contentStyle}>{this.props.children}</div>
        ) : (
          this.props.children
        )}
      </div>
    );
  }
}

const containerStyle = {
  display: "block",
  position: "relative",
} satisfies CSSProperties;

const tapeContainerStyle = {
  ...containerStyle,
  overflow: "hidden",
} satisfies CSSProperties;

const contentStyle = {
  display: "block",
  transform: `translateX(calc(-1 * var(${TAPE_SCROLL_PROPERTY}, 0px)))`,
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

function registerTapeScrollProperty(): void {
  try {
    if (typeof CSS !== "undefined" && "registerProperty" in CSS) {
      CSS.registerProperty({
        name: TAPE_SCROLL_PROPERTY,
        syntax: "<length>",
        inherits: true,
        initialValue: "0px",
      });
    }
  } catch {
    // registerProperty throws if the property is already registered.
  }
}
