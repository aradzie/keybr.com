import { type CSSProperties, PureComponent, type ReactNode } from "react";
import { Char_Backspace, Char_LineFeed, Char_Tab } from "./chars.ts";
import { eventTimeStamp } from "./events.ts";
import { type KeyEvent } from "./types.ts";

// https://w3c.github.io/uievents/
// https://www.w3.org/TR/input-events-1/
// https://www.w3.org/TR/input-events-2/
// https://domeventviewer.com/key-event-viewer.html

type Props = {
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly onKeyDown?: (event: KeyEvent) => void;
  readonly onKeyUp?: (event: KeyEvent) => void;
  readonly onInput?: (codePoint: number, timeStamp: number) => void;
};

const divStyle: CSSProperties = {
  position: "absolute",
  top: "0px",
  left: "0px",
  width: "0px",
  height: "0px",
  overflow: "hidden",
};

const inputStyle: CSSProperties = {
  display: "block",
  margin: "0px",
  padding: "0px",
  width: "1em",
  height: "1em",
  border: "none",
  outline: "none",
};

export class TextEvents extends PureComponent<Props> {
  private input: HTMLInputElement | null = null;

  private compositing = false;

  override componentDidMount(): void {
    const { input } = this;
    if (input != null) {
      input.addEventListener("focus", this.handleFocus);
      input.addEventListener("blur", this.handleBlur);
      input.addEventListener("keydown", this.handleKeyDown);
      input.addEventListener("keyup", this.handleKeyUp);
      input.addEventListener("input", this.handleInput as any);
      input.addEventListener("compositionstart", this.handleComposition);
      input.addEventListener("compositionupdate", this.handleComposition);
      input.addEventListener("compositionend", this.handleComposition);
      input.addEventListener("cut", this.handleClipboard);
      input.addEventListener("copy", this.handleClipboard);
      input.addEventListener("paste", this.handleClipboard);
    }
    this.focus();
  }

  override componentWillUnmount() {
    const { input } = this;
    if (input != null) {
      input.removeEventListener("focus", this.handleFocus);
      input.removeEventListener("blur", this.handleBlur);
      input.removeEventListener("keydown", this.handleKeyDown);
      input.removeEventListener("keyup", this.handleKeyUp);
      input.removeEventListener("input", this.handleInput as any);
      input.removeEventListener("compositionstart", this.handleComposition);
      input.removeEventListener("compositionupdate", this.handleComposition);
      input.removeEventListener("compositionend", this.handleComposition);
      input.removeEventListener("cut", this.handleClipboard);
      input.removeEventListener("copy", this.handleClipboard);
      input.removeEventListener("paste", this.handleClipboard);
    }
  }

  isFocused(): boolean {
    return this.input != null && document.activeElement === this.input;
  }

  focus(): void {
    if (this.input != null && document.activeElement !== this.input) {
      this.input.focus();
    }
  }

  blur(): void {
    if (this.input != null && document.activeElement === this.input) {
      this.input.blur();
    }
  }

  override render(): ReactNode {
    return (
      <div style={divStyle}>
        <input
          ref={(input) => {
            this.input = input;
          }}
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          style={inputStyle}
        />
      </div>
    );
  }

  private handleFocus = (event: FocusEvent): void => {
    const { onFocus } = this.props;
    if (onFocus != null) {
      onFocus();
    }
  };

  private handleBlur = (event: FocusEvent): void => {
    const { onBlur } = this.props;
    if (onBlur != null) {
      onBlur();
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof KeyboardEvent && event.isTrusted)) {
        return;
      }
    }
    const timeStamp = eventTimeStamp(event);
    const { onKeyDown } = this.props;
    if (onKeyDown != null) {
      onKeyDown(toKeyEvent(event, timeStamp));
    }
    const { ctrlKey, altKey, metaKey, key } = event;
    if (!(ctrlKey || altKey || metaKey)) {
      switch (key) {
        case "Backspace":
          this.sendChar(Char_Backspace, timeStamp);
          event.preventDefault();
          break;
        case "Tab":
          this.sendChar(Char_Tab, timeStamp);
          event.preventDefault();
          break;
        case "Enter":
          this.sendChar(Char_LineFeed, timeStamp);
          event.preventDefault();
          break;
      }
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof KeyboardEvent && event.isTrusted)) {
        return;
      }
    }
    const timeStamp = eventTimeStamp(event);
    const { onKeyUp } = this.props;
    if (onKeyUp != null) {
      onKeyUp(toKeyEvent(event, timeStamp));
    }
  };

  private handleInput = (event: InputEvent): void => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof InputEvent && event.isTrusted)) {
        return;
      }
    }
    const timeStamp = eventTimeStamp(event);
    switch (event.inputType) {
      case "insertText":
      case "insertCompositionText":
        if (!this.compositing) {
          this.sendEventData(event.data, timeStamp);
        }
        break;
    }
  };

  private handleComposition = (event: CompositionEvent): void => {
    const timeStamp = eventTimeStamp(event);
    switch (event.type) {
      case "compositionstart":
      case "compositionupdate":
        this.compositing = true;
        break;
      case "compositionend":
        this.compositing = false;
        this.sendEventData(event.data, timeStamp);
        break;
    }
  };

  private handleClipboard = (event: ClipboardEvent): void => {
    event.preventDefault();
  };

  private sendChar(codePoint: number, timeStamp: number): void {
    const { onInput } = this.props;
    if (onInput != null) {
      onInput(codePoint, timeStamp);
    }
    this.clearInput();
  }

  private sendEventData(data: string | null, timeStamp: number): void {
    const { onInput } = this.props;
    if (onInput != null) {
      if (data != null && data.length > 0) {
        onInput(data.codePointAt(0) ?? 0, timeStamp);
      }
    }
    this.clearInput();
  }

  private clearInput(): void {
    const { input } = this;
    if (input != null) {
      input.value = "";
    }
  }
}

function toKeyEvent(
  {
    code,
    key,
    shiftKey,
    altKey,
    ctrlKey,
    metaKey,
    location,
    repeat,
  }: KeyboardEvent,
  timeStamp: number,
): KeyEvent {
  return {
    timeStamp,
    code,
    key,
    shiftKey,
    altKey,
    ctrlKey,
    metaKey,
    location,
    repeat,
  };
}
