import { getModifiers } from "./modifiers.ts";
import { type IKeyboardEvent } from "./types.ts";

export function mapEvent(event: KeyboardEvent): IKeyboardEvent {
  if (event.type === "keydown" || event.type === "keyup") {
    return {
      type: event.type,
      timeStamp: timeStampOf(event),
      code: event.code,
      key: event.key,
      modifiers: getModifiers(event),
    };
  } else {
    throw new TypeError();
  }
}

export function timeStampOf({ timeStamp }: Event): number {
  return timeStamp || performance.now();
}
