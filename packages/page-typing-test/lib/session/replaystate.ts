import { type KeyId } from "@keybr/keyboard";
import { Timer } from "@keybr/lang";
import { addKey, type AnyEvent, deleteKey } from "@keybr/textinput-events";

export class ReplayState {
  #events: readonly AnyEvent[];
  #timer = new Timer();
  #index = 0;
  #depressedKeys: KeyId[] = [];

  constructor(events: readonly AnyEvent[]) {
    this.#events = events;
  }

  get delay() {
    if (this.#events.length === this.#index) {
      return 1000;
    }
    const event = this.#events[this.#index];
    return Math.max(0, event.timeStamp - this.#timer.elapsed);
  }

  step() {
    if (this.#events.length === this.#index) {
      this.#timer = new Timer();
      this.#index = 0;
      this.#depressedKeys = [];
      return;
    }
    const event = this.#events[this.#index];
    switch (event.type) {
      case "keydown":
        this.#depressedKeys = addKey(this.#depressedKeys, event.code);
        break;
      case "keyup":
        this.#depressedKeys = deleteKey(this.#depressedKeys, event.code);
        break;
    }
    this.#index += 1;
  }

  get depressedKeys() {
    return this.#depressedKeys;
  }
}
