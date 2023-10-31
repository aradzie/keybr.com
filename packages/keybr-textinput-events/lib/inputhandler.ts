import { ModifierState } from "./modifiers.ts";
import { type Focusable, type KeyEvent, type TextInputEvent } from "./types.ts";

// https://w3c.github.io/uievents/
// https://www.w3.org/TR/input-events-1/
// https://www.w3.org/TR/input-events-2/
// https://domeventviewer.com/key-event-viewer.html

export type Listeners = {
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly onKeyDown?: (event: KeyEvent) => void;
  readonly onKeyUp?: (event: KeyEvent) => void;
  readonly onTextInput?: (event: TextInputEvent) => void;
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
      input.addEventListener("beforeinput", this.handleBeforeInput as any);
      input.addEventListener("input", this.handleInput as any);
      input.addEventListener("compositionstart", this.handleComposition);
      input.addEventListener("compositionupdate", this.handleComposition);
      input.addEventListener("compositionend", this.handleComposition);
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
      input.removeEventListener("beforeinput", this.handleBeforeInput as any);
      input.removeEventListener("input", this.handleInput as any);
      input.removeEventListener("compositionstart", this.handleComposition);
      input.removeEventListener("compositionupdate", this.handleComposition);
      input.removeEventListener("compositionend", this.handleComposition);
    }
  }

  private clearInput(): void {
    const { input } = this;
    if (input != null) {
      // Keep the input value non-empty, otherwise Safari will not generate
      // events `deleteContentBackward` and `deleteWordBackward`.
      input.value = "?";
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
    const { ctrlKey, altKey, metaKey, code } = event;
    if (!(ctrlKey || altKey || metaKey)) {
      switch (code) {
        case "Tab":
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

  private handleBeforeInput = (event: InputEvent): void => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof InputEvent && event.isTrusted)) {
        return;
      }
    }
    const timeStamp = timeStampOf(event);
    switch (event.inputType) {
      case "insertLineBreak":
        this.listeners.onTextInput?.({
          timeStamp,
          inputType: "appendChar",
          codePoint: 0x0020,
        });
        this.clearInput();
        break;
      case "deleteContentBackward":
        this.listeners.onTextInput?.({
          timeStamp,
          inputType: "clearChar",
          codePoint: 0x0000,
        });
        this.clearInput();
        break;
      case "deleteWordBackward":
        this.listeners.onTextInput?.({
          timeStamp,
          inputType: "clearWord",
          codePoint: 0x0000,
        });
        this.clearInput();
        break;
    }
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
        this.appendChar(event.data, timeStamp);
        this.clearInput();
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
        this.appendChar(event.data, timeStamp);
        this.clearInput();
        break;
    }
  };

  private appendChar(data: string | null, timeStamp: number): void {
    if (data != null && data.length > 0) {
      const codePoint = data.codePointAt(0) ?? 0x0000;
      if (codePoint > 0x0000) {
        this.listeners.onTextInput?.({
          timeStamp,
          inputType: "appendChar",
          codePoint,
        });
      }
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

function timeStampOf({ timeStamp }: { timeStamp: number }): number {
  // Mobile Safari reports zero time stamps, so here's a workaround.
  return Math.round(timeStamp || performance.now());
}
