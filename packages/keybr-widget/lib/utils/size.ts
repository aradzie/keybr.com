import isNumber from "lodash/isNumber";
import isObject from "lodash/isObject";
import isObjectLike from "lodash/isObjectLike";

export type TSize = {
  width: number;
  height: number;
};

export class Size implements Readonly<TSize> {
  public readonly width: number;
  public readonly height: number;

  constructor(width: number, height: number);
  constructor(size: Readonly<TSize>);
  constructor(...args: any[]) {
    const l = args.length;
    let o: TSize, w: number, h: number;
    if (l === 2 && isNumber((w = args[0])) && isNumber((h = args[1]))) {
      this.width = w;
      this.height = h;
      return this;
    }
    if (
      l === 1 &&
      isObject((o = args[0])) &&
      isNumber((w = o.width)) &&
      isNumber((h = o.height))
    ) {
      this.width = w;
      this.height = h;
      return this;
    }
    throw new TypeError();
  }

  eq(that: Size): boolean {
    return this.width === that.width && this.height === that.height;
  }

  round(): Size {
    return new Size(Math.round(this.width), Math.round(this.height));
  }

  static isSize(o: any): o is TSize {
    return isObjectLike(o) && isNumber(o.width) && isNumber(o.height);
  }
}
