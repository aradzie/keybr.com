import { Char_Backspace, Char_LineFeed, Char_Tab } from "./chars.ts";
import { ModifierState } from "./modifiers.ts";
import { type Focusable, type KeyEvent } from "./types.ts";

// https://w3c.github.io/uievents/
// https://www.w3.org/TR/input-events-1/
// https://www.w3.org/TR/input-events-2/
// https://domeventviewer.com/key-event-viewer.html

export type Listeners = {
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly onKeyDown?: (event: KeyEvent) => void;
  readonly onKeyUp?: (event: KeyEvent) => void;
  readonly onInput?: (codePoint: number, timeStamp: number) => void;
};

export class InputHandler implements Focusable {
  private listeners: Listeners = {};
  private input: HTMLInputElement | null = null;
  private compositing: boolean = false;

  setListeners = (listeners: Listeners): void => {
    this.listeners = listeners;
  };

  setInput = (input: HTMLInputElement | null): void => {
    if (input != null) {
      this.input = input;
      this.attachInput();
    } else {
      this.detachInput();
      this.input = null;
    }
  };

  focus = (): void => {
    this.input?.focus();
  };

  blur = (): void => {
    this.input?.blur();
  };

  private attachInput(): void {
    ModifierState.initialize();
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
    this.clearInput();
  }

  private detachInput(): void {
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

  private clearInput(): void {
    const { input } = this;
    if (input != null) {
      input.value = "";
    }
  }

  private handleFocus = (event: FocusEvent): void => {
    this.listeners.onFocus?.();
  };

  private handleBlur = (event: FocusEvent): void => {
    this.listeners.onBlur?.();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof KeyboardEvent && event.isTrusted)) {
        return;
      }
    }
    const timeStamp = timeStampOf(event);
    this.listeners.onKeyDown?.(toKeyEvent(event, timeStamp));
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
    const timeStamp = timeStampOf(event);
    this.listeners.onKeyUp?.(toKeyEvent(event, timeStamp));
  };

  private handleInput = (event: InputEvent): void => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof InputEvent && event.isTrusted)) {
        return;
      }
    }
    const timeStamp = timeStampOf(event);
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
    const timeStamp = timeStampOf(event);
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
    this.listeners.onInput?.(codePoint, timeStamp);
    this.clearInput();
  }

  private sendEventData(data: string | null, timeStamp: number): void {
    if (data != null && data.length > 0) {
      this.listeners.onInput?.(data.codePointAt(0) ?? 0, timeStamp);
    }
    this.clearInput();
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

function timeStampOf({ timeStamp }: { timeStamp: number }): number {
  // Mobile Safari reports zero time stamps, so here's a workaround.
  return Math.round(timeStamp || performance.now());
}
