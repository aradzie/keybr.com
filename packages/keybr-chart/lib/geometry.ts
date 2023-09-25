import { Point, Rect } from "@keybr/widget";

export type Tick<T> = { readonly value: T; readonly point: Point };
export type Box<T> = { readonly value: T; readonly rect: Rect };

export function vTicks<T>(box: Rect, items: readonly T[]): Tick<T>[] {
  const { length } = items;
  if (length < 2) {
    throw new Error();
  }
  return items.map((value, index) => ({
    value,
    point: new Point(
      box.x + (box.width / (length - 1)) * index, // x
      box.y, // y
    ).round(),
  }));
}

export function hTicks<T>(box: Rect, items: readonly T[]): Tick<T>[] {
  const { length } = items;
  if (length < 2) {
    throw new Error();
  }
  return items.map((value, index) => ({
    value,
    point: new Point(
      box.x, // x
      box.y + (box.height - (box.height / (length - 1)) * index), // y
    ).round(),
  }));
}

export function vBoxes<T>(
  box: Rect,
  items: readonly T[],
  { margin = 0 }: { margin?: number } = {},
): Box<T>[] {
  const { length } = items;
  if (length === 0) {
    throw new Error();
  }
  if (length === 1) {
    return [{ value: items[0], rect: box.round() }];
  }
  const size = (box.width + margin) / length;
  const w = size - margin;
  const h = box.height;
  return items.map((value, index) => ({
    value,
    rect: new Rect(box.x + index * size, box.y, w, h).round(),
  }));
}

export function hBoxes<T>(
  box: Rect,
  items: readonly T[],
  { margin = 0 }: { margin?: number } = {},
): Box<T>[] {
  const { length } = items;
  if (length === 0) {
    throw new Error();
  }
  if (length === 1) {
    return [{ value: items[0], rect: box.round() }];
  }
  const size = (box.height + margin) / length;
  const w = box.width;
  const h = size - margin;
  return items.map((value, index) => ({
    value,
    rect: new Rect(box.x, box.y + index * size, w, h).round(),
  }));
}
