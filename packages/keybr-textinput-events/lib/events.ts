import { getModifiers } from "./modifiers.ts";
import { type IKeyboardEvent } from "./types.ts";

export function mapEvent(event: KeyboardEvent): IKeyboardEvent {
  if (event.type === "keydown" || event.type === "keyup") {
    return {
      type: event.type,
      timeStamp: event.timeStamp,
      code: event.code,
      key: event.key,
      modifiers: getModifiers(event),
    };
  } else {
    throw new TypeError();
  }
}
