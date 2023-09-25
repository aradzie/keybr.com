import { generateName } from "@keybr/names";
import { hashCode } from "@keybr/rand";

export function anonymousName(hint: number | string): string {
  let seed = 0;
  switch (typeof hint) {
    case "number":
      if (hint === 0) {
        throw new TypeError();
      }
      seed = hint;
      break;
    case "string":
      if (hint === "") {
        throw new TypeError();
      }
      seed = hashCode(hint);
      break;
    default:
      throw new TypeError();
  }
  return generateName({ seed });
}
