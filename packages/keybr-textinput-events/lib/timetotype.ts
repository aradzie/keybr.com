type SimpleEvent = {
  timeStamp: number;
  type: string;
  code?: string;
  key?: string;
};

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
  #events: SimpleEvent[] = [];
  #timeStamp: number = 0;

  keyDown(event: Omit<SimpleEvent, "type">): void {
    this.add({ ...event, type: "keydown" });
  }

  keyUp(event: Omit<SimpleEvent, "type">): void {
    this.add({ ...event, type: "keyup" });
  }

  add({ timeStamp, type, code, key }: SimpleEvent): void {
    if (type === "keydown" && code) {
      // When the AltGraph key is pressed in Windows,
      // it generates a pair of events, Control then AltGraph.
      // We are only interested in the AltGraph event.
      const last = this.#events.at(-1);
      if (last?.key === "Control" && key === "AltGraph") {
        this.#events.pop();
      }
      this.#events.push({ timeStamp, type, code, key });
    }

    if (type === "keyup" && code) {
      let index = 0;
      while (index < this.#events.length) {
        const event = this.#events[index];
        if (event.code === code) {
          this.#events.splice(index, 1);
          if (event.timeStamp > this.#timeStamp) {
            this.#timeStamp = event.timeStamp;
          }
        } else {
          index += 1;
        }
      }
    }
  }

  measure({ timeStamp }: Pick<SimpleEvent, "timeStamp">): number {
    const count = Math.max(1, this.#events.length);
    this.#events.length = 0;
    const timeToType = timeStamp - this.#timeStamp;
    this.#timeStamp = timeStamp;
    return timeToType / count;
  }
}
