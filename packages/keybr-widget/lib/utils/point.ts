import { isNumber, isObject, isObjectLike } from "@keybr/lang";

export type TPoint = {
  x: number;
  y: number;
};

export class Point implements Readonly<TPoint> {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number);
  constructor(point: Readonly<TPoint>);
  constructor(...args: any[]) {
    const l = args.length;
    let o: TPoint, x: number, y: number;
    if (l === 2 && isNumber((x = args[0])) && isNumber((y = args[1]))) {
      this.x = x;
      this.y = y;
      return this;
    }
    if (
      l === 1 &&
      isObject((o = args[0])) &&
      isNumber((x = o.x)) &&
      isNumber((y = o.y))
    ) {
      this.x = x;
      this.y = y;
      return this;
    }
    throw new TypeError();
  }

  eq(that: Point): boolean {
    return this.x === that.x && this.y === that.y;
  }

  round(): Point {
    return new Point(Math.round(this.x), Math.round(this.y));
  }

  static isPoint(o: any): o is TPoint {
    return isObjectLike(o) && isNumber(o.x) && isNumber(o.y);
  }
}
