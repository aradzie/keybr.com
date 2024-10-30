import { type IInputEvent, type IKeyboardEvent } from "./types.ts";

/**
 * Measures the time taken to type a character.
 * Takes into account the number of modifier keys pressed
 * between the text input events.
 *
 * Some characters are harder to type than others because they require
 * modifier keys.
 *
 * The simplest case is when we press a character key directly.
 * The following example requires only one key press:
 *
 * ```
 *  1. keydown KeyA
 *  2. keyup   KeyA
 * ```
 *
 * A more complicated case is when press several modifier keys
 * along with a character key.
 * The following example requires three key presses:
 *
 * ```
 *  1. keydown Shift
 *  2. keydown AltGraph
 *  3. keydown KeyA
 *  4. keyup   KeyA
 *  5. keyup   Shift
 *  6. keyup   AltGraph
 * ```
 *
 * Or even mode complicated case when we press a combination of
 * modifiers with a dead key followed by modifiers with a character key:
 * Six keys must be pressed in the following example to input a character:
 *
 * ```
 *  1. keydown Shift
 *  2. keydown AltGraph
 *  3. keydown Dead
 *  4. keyup   Dead
 *  5. keyup   Shift
 *  6. keyup   AltGraph
 *  7. keydown Shift
 *  8. keydown AltGraph
 *  9. keydown KeyA
 * 10. keyup   KeyA
 * 11. keyup   Shift
 * 12. keyup   AltGraph
 * ```
 */
export class TimeToType {
  #down = new Map<string, IKeyboardEvent>();
  #timeStamp = 0;

  add(event: IKeyboardEvent): void {
    const { type, code, key } = event;
    if (code && key) {
      if (type === "keydown") {
        if (
          key === "Shift" ||
          key === "Alt" ||
          key === "AltGraph" ||
          key === "Dead"
        ) {
          this.#down.set(code, event);
        }
      }
      if (type === "keyup") {
        const down = this.#down.get(code);
        if (down != null && down.key === "Dead") {
          this.#timeStamp = down.timeStamp;
        }
        this.#down.delete(code);
      }
    }
  }

  measure({ timeStamp }: Pick<IInputEvent, "timeStamp">): number {
    const size = this.#down.size;
    this.#down.clear();
    const duration = timeStamp - this.#timeStamp;
    this.#timeStamp = timeStamp;
    return duration / (size + 1);
  }
}
