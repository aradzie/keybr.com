import { type KeyId } from "@keybr/keyboard";

const capsLock = "CapsLock" as const;
const numLock = "NumLock" as const;

let initialized = false;

/**
 * A static global object which track the state of the modifier keys,
 * such as `CapsLock`, `NumLock`, etc.
 */
export class ModifierState {
  static readonly allModifiers: readonly KeyId[] = [capsLock, numLock];
  static #modifiers: readonly KeyId[] = [];

  static get modifiers(): readonly KeyId[] {
    return this.#modifiers;
  }

  static #handleKeyDown(event: KeyboardEvent): void {
    const modifiers = getModifiers(event);
    switch (event.code) {
      case capsLock:
      case numLock:
        // TODO Fill me in.
        break;
      default:
        ModifierState.#modifiers = modifiers.filter((m) =>
          ModifierState.allModifiers.includes(m),
        );
        break;
    }
  }

  static #handleKeyUp(event: KeyboardEvent): void {
    const modifiers = getModifiers(event);
    switch (event.code) {
      case capsLock:
      case numLock:
        // TODO Fill me in.
        break;
      default:
        ModifierState.#modifiers = modifiers.filter((m) =>
          ModifierState.allModifiers.includes(m),
        );
        break;
    }
  }

  static initialize() {
    if (!initialized) {
      // ModifierState must receive keyboard events before any other event listener.
      window.addEventListener("keydown", ModifierState.#handleKeyDown);
      window.addEventListener("keyup", ModifierState.#handleKeyUp);
      initialized = true;
    }
  }
}

function getModifiers(event: KeyboardEvent): KeyId[] {
  return ModifierState.allModifiers.filter((m) => event.getModifierState(m));
}
