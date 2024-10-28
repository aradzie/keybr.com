import { type Focusable } from "@keybr/widget";
import { toKeyEvent } from "./events.ts";
import { getModifiers, isTextInput, ModifierState } from "./modifiers.ts";
import { type KeyEvent, type TextInputEvent } from "./types.ts";

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
  #listeners: Listeners = {};
  #input: HTMLTextAreaElement | null = null;

  setListeners = (listeners: Listeners): void => {
    this.#listeners = listeners;
  };

  setInput = (input: HTMLTextAreaElement | null): void => {
    if (input != null) {
      this.#input = input;
      this.#attachInput();
    } else {
      this.#detachInput();
      this.#input = null;
    }
  };

  focus = (): void => {
    this.#input?.focus();
  };

  blur = (): void => {
    this.#input?.blur();
  };

  #attachInput(): void {
    ModifierState.initialize();
    const input = this.#input;
    if (input != null) {
      input.addEventListener("focus", this.handleFocus);
      input.addEventListener("blur", this.handleBlur);
      input.addEventListener("keydown", this.handleKeyDown);
      input.addEventListener("keyup", this.handleKeyUp);
      input.addEventListener("input", this.handleInput as any);
      input.addEventListener("compositionstart", this.handleComposition);
      input.addEventListener("compositionupdate", this.handleComposition);
      input.addEventListener("compositionend", this.handleComposition);
    }
    this.focus();
    this.#clearInput();
  }

  #detachInput(): void {
    const input = this.#input;
    if (input != null) {
      input.removeEventListener("focus", this.handleFocus);
      input.removeEventListener("blur", this.handleBlur);
      input.removeEventListener("keydown", this.handleKeyDown);
      input.removeEventListener("keyup", this.handleKeyUp);
      input.removeEventListener("input", this.handleInput as any);
      input.removeEventListener("compositionstart", this.handleComposition);
      input.removeEventListener("compositionupdate", this.handleComposition);
      input.removeEventListener("compositionend", this.handleComposition);
    }
  }

  #clearInput(): void {
    const input = this.#input;
    if (input != null) {
      // Keep the input value non-empty, otherwise Safari will not generate
      // events `deleteContentBackward` and `deleteWordBackward`.
      input.value = "?";
    }
  }

  handleFocus = (event: FocusEvent): void => {
    this.#listeners.onFocus?.();
  };

  handleBlur = (event: FocusEvent): void => {
    this.#listeners.onBlur?.();
  };

  handleKeyDown = (event: KeyboardEvent): void => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof KeyboardEvent && event.isTrusted)) {
        return;
      }
    }
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    this.#listeners.onKeyDown?.(toKeyEvent(event));
    if (isTextInput(getModifiers(event)) && event.key === "Tab") {
      event.preventDefault();
    }
  };

  handleKeyUp = (event: KeyboardEvent): void => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof KeyboardEvent && event.isTrusted)) {
        return;
      }
    }
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    this.#listeners.onKeyUp?.(toKeyEvent(event));
  };

  handleInput = (event: InputEvent): void => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof InputEvent && event.isTrusted)) {
        return;
      }
    }
    switch (event.inputType) {
      case "insertText":
        this.#appendChar(event.data, event.timeStamp);
        this.#clearInput();
        break;
      case "insertLineBreak":
        this.#listeners.onTextInput?.({
          timeStamp: event.timeStamp,
          inputType: "appendLineBreak",
          codePoint: 0x0000,
        });
        this.#clearInput();
        break;
      case "deleteContentBackward":
        this.#listeners.onTextInput?.({
          timeStamp: event.timeStamp,
          inputType: "clearChar",
          codePoint: 0x0000,
        });
        this.#clearInput();
        break;
      case "deleteWordBackward":
        this.#listeners.onTextInput?.({
          timeStamp: event.timeStamp,
          inputType: "clearWord",
          codePoint: 0x0000,
        });
        this.#clearInput();
        break;
      case "insertFromPaste":
        this.#clearInput();
        break;
    }
  };

  handleComposition = (event: CompositionEvent): void => {
    switch (event.type) {
      case "compositionstart":
      case "compositionupdate":
        break;
      case "compositionend":
        this.#appendChar(event.data, event.timeStamp);
        this.#clearInput();
        break;
    }
  };

  #appendChar(data: string | null, timeStamp: number): void {
    if (data != null && data.length > 0) {
      const codePoint = data.codePointAt(0) ?? 0x0000;
      if (codePoint > 0x0000) {
        this.#listeners.onTextInput?.({
          timeStamp,
          inputType: "appendChar",
          codePoint,
        });
      }
    }
  }
}
