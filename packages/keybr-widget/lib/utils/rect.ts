import { isNumber, isObjectLike } from "@keybr/lang";
import { Point, type TPoint } from "./point.ts";
import { Size, type TSize } from "./size.ts";

export type TRect = TPoint & TSize;

export class Rect implements Readonly<TRect> {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  constructor(x: number, y: number, width: number, height: number);
  constructor(point: Readonly<TPoint>, size: Readonly<TSize>);
  constructor(rect: Readonly<TRect>);
  constructor(...args: any[]) {
    const l = args.length;
    let p: TPoint,
      s: TSize,
      o: TRect,
      x: number,
      y: number,
      w: number,
      h: number;
    if (
      l === 4 &&
      isNumber((x = args[0])) &&
      isNumber((y = args[1])) &&
      isNumber((w = args[2])) &&
      isNumber((h = args[3]))
    ) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      return this;
    }
    if (l === 2 && Point.isPoint((p = args[0])) && Size.isSize((s = args[1]))) {
      this.x = p.x;
      this.y = p.y;
      this.width = s.width;
      this.height = s.height;
      return this;
    }
    if (
      l === 1 &&
      isObjectLike((o = args[0])) &&
      isNumber((x = o.x)) &&
      isNumber((y = o.y)) &&
      isNumber((w = o.width)) &&
      isNumber((h = o.height))
    ) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      return this;
    }
    throw new TypeError();
  }

  eq(that: Rect): boolean {
    return (
      this.x === that.x &&
      this.y === that.y &&
      this.width === that.width &&
      this.height === that.height
    );
  }

  round(): Rect {
    return new Rect(
      Math.round(this.x),
      Math.round(this.y),
      Math.round(this.width),
      Math.round(this.height),
    );
  }

  get cx(): number {
    return this.x + this.width / 2;
  }

  get cy(): number {
    return this.y + this.height / 2;
  }

  get left(): number {
    return Math.min(this.x, this.x + this.width);
  }

  get right(): number {
    return Math.max(this.x, this.x + this.width);
  }

  get top(): number {
    return Math.min(this.y, this.y + this.height);
  }

  get bottom(): number {
    return Math.max(this.y, this.y + this.height);
  }

  static isRect(o: any): o is TRect {
    return (
      isObjectLike(o) &&
      isNumber(o.x) &&
      isNumber(o.y) &&
      isNumber(o.width) &&
      isNumber(o.height)
    );
  }
}
