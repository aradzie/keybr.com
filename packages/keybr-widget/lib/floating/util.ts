import {
  type FloatingPlacement,
  type FloatingPosition,
  type FloatingSide,
} from "./types.ts";

export function splitPosition(
  position: FloatingPosition,
): [side: FloatingSide, placement: FloatingPlacement] {
  switch (position) {
    case "block-start":
      return ["block-start", "center"];
    case "block-start-start":
      return ["block-start", "start"];
    case "block-start-end":
      return ["block-start", "end"];
    case "block-end":
      return ["block-end", "center"];
    case "block-end-start":
      return ["block-end", "start"];
    case "block-end-end":
      return ["block-end", "end"];
    case "inline-start":
      return ["inline-start", "center"];
    case "inline-start-start":
      return ["inline-start", "start"];
    case "inline-start-end":
      return ["inline-start", "end"];
    case "inline-end":
      return ["inline-end", "center"];
    case "inline-end-start":
      return ["inline-end", "start"];
    case "inline-end-end":
      return ["inline-end", "end"];
  }
  throw new TypeError();
}
