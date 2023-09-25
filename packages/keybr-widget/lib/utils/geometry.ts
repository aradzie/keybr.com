import { Point } from "./point.ts";
import { Rect } from "./rect.ts";
import { Size } from "./size.ts";

export const screenSize = (): Size => {
  return new Size(window.innerWidth, window.innerHeight);
};

export const screenScrollOffset = (): Point => {
  return new Point(window.scrollX, window.scrollY);
};

export const elementSize = (el: Element): Size => {
  return new Size(el.clientWidth, el.clientHeight);
};

export const boundingBox = (el: Element): Rect => {
  const { x, y, width, height } = el.getBoundingClientRect();
  return new Rect(x, y, width, height);
};
