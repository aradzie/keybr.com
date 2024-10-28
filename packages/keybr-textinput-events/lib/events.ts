import { getModifiers } from "./modifiers.ts";
import { type KeyEvent } from "./types.ts";

export function toKeyEvent(event: KeyboardEvent): KeyEvent {
  return {
    timeStamp: event.timeStamp,
    code: event.code,
    key: event.key,
    modifiers: getModifiers(event),
  };
}
