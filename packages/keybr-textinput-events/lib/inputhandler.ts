import { type Focusable } from "@keybr/widget";
import { mapEvent, timeStampOf } from "./events.ts";
import { isTextInput, ModifierState } from "./modifiers.ts";
import { TimeToType } from "./timetotype.ts";
import { type InputListener } from "./types.ts";

// https://w3c.github.io/uievents/
// https://www.w3.org/TR/input-events-1/
// https://www.w3.org/TR/input-events-2/
// https://domeventviewer.com/key-event-viewer.html

export type Callbacks = {
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
} & Partial<InputListener>;

export class InputHandler implements Focusable {
  readonly #timeToType = new TimeToType();
  #callbacks: Callbacks = {};
  #input: HTMLTextAreaElement | null = null;

  setCallbacks(callbacks: Callbacks) {
    this.#callbacks = callbacks;
  }

  setInput(input: HTMLTextAreaElement | null) {
    if (input != null) {
      this.#input = input;
      this.#attachInput();
    } else {
      this.#detachInput();
      this.#input = null;
    }
  }

  focus() {
    this.#input?.focus();
  }

  blur() {
    this.#input?.blur();
  }

  #attachInput() {
    ModifierState.initialize();
    const input = this.#input;
    if (input != null) {
      input.addEventListener("focus", this.handleFocus);
      input.addEventListener("blur", this.handleBlur);
      input.addEventListener("keydown", this.handleKeyboard);
      input.addEventListener("keyup", this.handleKeyboard);
      input.addEventListener("input", this.handleInput as any);
      input.addEventListener("compositionstart", this.handleComposition);
      input.addEventListener("compositionupdate", this.handleComposition);
      input.addEventListener("compositionend", this.handleComposition);
    }
    this.focus();
    this.#clearInput();
  }

  #detachInput() {
    const input = this.#input;
    if (input != null) {
      input.removeEventListener("focus", this.handleFocus);
      input.removeEventListener("blur", this.handleBlur);
      input.removeEventListener("keydown", this.handleKeyboard);
      input.removeEventListener("keyup", this.handleKeyboard);
      input.removeEventListener("input", this.handleInput as any);
      input.removeEventListener("compositionstart", this.handleComposition);
      input.removeEventListener("compositionupdate", this.handleComposition);
      input.removeEventListener("compositionend", this.handleComposition);
    }
  }

  #clearInput() {
    const input = this.#input;
    if (input != null) {
      // Keep the input value non-empty, otherwise Safari will not generate
      // events `deleteContentBackward` and `deleteWordBackward`.
      input.value = "?";
    }
  }

  handleFocus = () => {
    this.#callbacks.onFocus?.();
  };

  handleBlur = () => {
    this.#callbacks.onBlur?.();
  };

  handleKeyboard = (event: KeyboardEvent) => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof KeyboardEvent && event.isTrusted)) {
        return;
      }
    }
    if (event.repeat) {
      event.preventDefault();
      return;
    }
    const mapped = mapEvent(event);
    if (isTextInput(mapped.modifiers) && event.key === "Tab") {
      event.preventDefault();
    }
    if (event.code) {
      this.#timeToType.add(mapped);
      switch (mapped.type) {
        case "keydown":
          this.#callbacks.onKeyDown?.(mapped);
          break;
        case "keyup":
          this.#callbacks.onKeyUp?.(mapped);
          break;
      }
    }
  };

  handleInput = (event: InputEvent) => {
    if (process.env.NODE_ENV === "production") {
      if (!(event instanceof InputEvent && event.isTrusted)) {
        return;
      }
    }
    switch (event.inputType) {
      case "insertText":
        this.#appendChar(event);
        this.#clearInput();
        break;
      case "insertLineBreak":
        this.#callbacks.onInput?.({
          type: "input",
          timeStamp: timeStampOf(event),
          inputType: "appendLineBreak",
          codePoint: 0x0000,
          timeToType: this.#timeToType.measure(event),
        });
        this.#clearInput();
        break;
      case "deleteContentBackward":
        this.#callbacks.onInput?.({
          type: "input",
          timeStamp: timeStampOf(event),
          inputType: "clearChar",
          codePoint: 0x0000,
          timeToType: this.#timeToType.measure(event),
        });
        this.#clearInput();
        break;
      case "deleteWordBackward":
        this.#callbacks.onInput?.({
          type: "input",
          timeStamp: timeStampOf(event),
          inputType: "clearWord",
          codePoint: 0x0000,
          timeToType: this.#timeToType.measure(event),
        });
        this.#clearInput();
        break;
      case "insertFromPaste":
        this.#clearInput();
        break;
    }
  };

  handleComposition = (event: CompositionEvent) => {
    switch (event.type) {
      case "compositionstart":
      case "compositionupdate":
        break;
      case "compositionend":
        this.#appendChar(event);
        this.#clearInput();
        break;
    }
  };

  #appendChar(event: InputEvent | CompositionEvent) {
    const { data } = event;
    if (data != null && data.length > 0) {
      const codePoint = data.codePointAt(0) ?? 0x0000;
      if (codePoint > 0x0000) {
        this.#callbacks.onInput?.({
          type: "input",
          timeStamp: timeStampOf(event),
          inputType: "appendChar",
          codePoint,
          timeToType: this.#timeToType.measure(event),
        });
      }
    }
  }
}
