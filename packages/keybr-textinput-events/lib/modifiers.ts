import { type KeyId } from "@keybr/keyboard";

const capsLock = "CapsLock" as const;
const numLock = "NumLock" as const;

let initialized = false;
let modifiers: readonly KeyId[] = [];

/**
 * A static global object which tracks the state of the modifier keys,
 * such as `CapsLock`, `NumLock`, etc.
 */
export class ModifierState {
  static get modifiers(): readonly KeyId[] {
    return modifiers;
  }

  static get capsLock(): boolean {
    return modifiers.includes(capsLock);
  }

  static get numLock(): boolean {
    return modifiers.includes(numLock);
  }

  static initialize() {
    if (!initialized) {
      // ModifierState must receive keyboard events before any other event listener.
      window.addEventListener("keydown", (event) => {
        modifiers = getModifiers(event);
      });
      window.addEventListener("keyup", (event) => {
        modifiers = getModifiers(event);
      });
      initialized = true;
    }
  }
}

function getModifiers(event: KeyboardEvent): KeyId[] {
  return [capsLock, numLock].filter((m) => event.getModifierState(m));
}
