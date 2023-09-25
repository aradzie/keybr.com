export type Command =
  | Command.Z
  | Command.M
  | Command.m
  | Command.L
  | Command.l
  | Command.H
  | Command.h
  | Command.V
  | Command.v
  | Command.A
  | Command.a
  | Command.C
  | Command.c
  | Command.S
  | Command.s
  | Command.Q
  | Command.q
  | Command.T
  | Command.t;

export declare namespace Command {
  // Close path.
  export type Z = {
    readonly type: "Z";
  };
  // Move to, absolute.
  export type M = {
    readonly type: "M";
    readonly x: number;
    readonly y: number;
  };
  // Move to, relative.
  export type m = {
    readonly type: "m";
    readonly dx: number;
    readonly dy: number;
  };
  // Line to, absolute.
  export type L = {
    readonly type: "L";
    readonly x: number;
    readonly y: number;
  };
  // Line to, relative.
  export type l = {
    readonly type: "l";
    readonly dx: number;
    readonly dy: number;
  };
  // Horizontal line to, absolute.
  export type H = {
    readonly type: "H";
    readonly x: number;
  };
  // Horizontal line to, relative.
  export type h = {
    readonly type: "h";
    readonly dx: number;
  };
  // Vertical line to, absolute.
  export type V = {
    readonly type: "V";
    readonly y: number;
  };
  // Vertical line to, relative.
  export type v = {
    readonly type: "v";
    readonly dy: number;
  };
  // Arc.
  export type A = {
    readonly type: "A";
    readonly rx: number;
    readonly ry: number;
    readonly rotation: number;
    readonly largeArcFlag: 0 | 1;
    readonly sweepFlag: 0 | 1;
    readonly x: number;
    readonly y: number;
  };
  // Arc.
  export type a = {
    readonly type: "a";
    readonly rx: number;
    readonly ry: number;
    readonly rotation: number;
    readonly largeArcFlag: 0 | 1;
    readonly sweepFlag: 0 | 1;
    readonly dx: number;
    readonly dy: number;
  };
  // Curve.
  export type C = {
    readonly type: "C";
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
    readonly x: number;
    readonly y: number;
  };
  // Curve.
  export type c = {
    readonly type: "c";
    readonly dx1: number;
    readonly dy1: number;
    readonly dx2: number;
    readonly dy2: number;
    readonly dx: number;
    readonly dy: number;
  };
  // Curve.
  export type S = {
    readonly type: "S";
    readonly x2: number;
    readonly y2: number;
    readonly x: number;
    readonly y: number;
  };
  // Curve.
  export type s = {
    readonly type: "s";
    readonly dx2: number;
    readonly dy2: number;
    readonly dx: number;
    readonly dy: number;
  };
  export type Q = {
    readonly type: "Q";
    readonly x1: number;
    readonly y1: number;
    readonly x: number;
    readonly y: number;
  };
  // Curve.
  export type q = {
    readonly type: "q";
    readonly dx1: number;
    readonly dy1: number;
    readonly dx: number;
    readonly dy: number;
  };
  // Curve.
  export type T = {
    readonly type: "T";
    readonly x: number;
    readonly y: number;
  };
  // Curve.
  export type t = {
    readonly type: "t";
    readonly dx: number;
    readonly dy: number;
  };
}

export function renderPath(commands: readonly Command[], r = round): string {
  // See https://www.w3.org/TR/SVG/paths.html
  const parts: (string | number)[] = [];
  for (const command of commands) {
    switch (command.type) {
      case "Z":
        parts.push("Z");
        break;
      case "M": {
        const { x, y } = command;
        parts.push("M", x, y);
        break;
      }
      case "m": {
        const { dx, dy } = command;
        parts.push("m", dx, dy);
        break;
      }
      case "L": {
        const { x, y } = command;
        parts.push("L", x, y);
        break;
      }
      case "l": {
        const { dx, dy } = command;
        parts.push("l", dx, dy);
        break;
      }
      case "H": {
        const { x } = command;
        parts.push("H", x);
        break;
      }
      case "h": {
        const { dx } = command;
        parts.push("h", dx);
        break;
      }
      case "V": {
        const { y } = command;
        parts.push("V", y);
        break;
      }
      case "v": {
        const { dy } = command;
        parts.push("v", dy);
        break;
      }
      case "A": {
        const { rx, ry, rotation, largeArcFlag, sweepFlag, x, y } = command;
        parts.push("A", rx, ry, rotation, largeArcFlag, sweepFlag, x, y);
        break;
      }
      case "a": {
        const { rx, ry, rotation, largeArcFlag, sweepFlag, dx, dy } = command;
        parts.push("a", rx, ry, rotation, largeArcFlag, sweepFlag, dx, dy);
        break;
      }
      case "C": {
        const { x1, y1, x2, y2, x, y } = command;
        parts.push("C", x1, y1, x2, y2, x, y);
        break;
      }
      case "c": {
        const { dx1, dy1, dx2, dy2, dx, dy } = command;
        parts.push("c", dx1, dy1, dx2, dy2, dx, dy);
        break;
      }
      case "S": {
        const { x2, y2, x, y } = command;
        parts.push("S", x2, y2, x, y);
        break;
      }
      case "s": {
        const { dx2, dy2, dx, dy } = command;
        parts.push("s", dx2, dy2, dx, dy);
        break;
      }
      case "Q": {
        const { x1, y1, x, y } = command;
        parts.push("Q", x1, y1, x, y);
        break;
      }
      case "q": {
        const { dx1, dy1, dx, dy } = command;
        parts.push("q", dx1, dy1, dx, dy);
        break;
      }
      case "T": {
        const { x, y } = command;
        parts.push("T", x, y);
        break;
      }
      case "t": {
        const { dx, dy } = command;
        parts.push("t", dx, dy);
        break;
      }
      default:
        throw new TypeError();
    }
  }
  return parts.map((v) => (typeof v === "number" ? r(v) : v)).join(" ");
}

export class Point {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}
}

export class Graphics {
  constructor(
    private readonly path: Path,
    private readonly transform: Transform,
  ) {}

  addPolygon(points: readonly Point[], invert: boolean = false): void {
    this.path.addPolygon(this.transform.transformAll(points), invert);
  }

  addCircle(
    x: number,
    y: number,
    diameter: number,
    invert: boolean = false,
  ): void {
    this.path.addCircle(
      this.transform.transform(new Point(x, y), diameter, diameter),
      diameter,
      invert,
    );
  }
}

export class Path {
  private readonly commands: Command[] = [];

  addPolygon(points: readonly Point[], invert: boolean): void {
    if (invert) {
      points = [...points].reverse();
    }
    for (let i = 0; i < points.length; i++) {
      const { x, y } = points[i];
      if (i > 0) {
        this.commands.push({ type: "L", x, y });
      } else {
        this.commands.push({ type: "M", x, y });
      }
    }
    this.commands.push({ type: "Z" });
  }

  addCircle(position: Point, diameter: number, ccw: boolean): void {
    this.commands.push({
      type: "M",
      x: position.x,
      y: position.y + diameter / 2,
    });
    this.commands.push({
      type: "a",
      rx: diameter / 2,
      ry: diameter / 2,
      rotation: 0,
      largeArcFlag: 1,
      sweepFlag: ccw ? 0 : 1,
      dx: diameter,
      dy: 0,
    });
    this.commands.push({
      type: "a",
      rx: diameter / 2,
      ry: diameter / 2,
      rotation: 0,
      largeArcFlag: 1,
      sweepFlag: ccw ? 0 : 1,
      dx: -diameter,
      dy: 0,
    });
  }

  toString(): string {
    return renderPath(this.commands);
  }
}

export class Transform {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly size: number,
    private readonly rotation: number,
  ) {}

  transformAll(
    points: readonly Point[],
    w: number = 0,
    h: number = 0,
  ): Point[] {
    return points.map((point) => this.transform(point, w, h));
  }

  transform(point: Point, w: number = 0, h: number = 0): Point {
    const right = this.x + this.size;
    const bottom = this.y + this.size;
    switch (this.rotation % 4) {
      case 0:
        return new Point(this.x + point.x, this.y + point.y);
      case 1:
        return new Point(right - point.y - h, this.y + point.x);
      case 2:
        return new Point(right - point.x - w, bottom - point.y - h);
      case 3:
        return new Point(this.x + point.y, bottom - point.x - w);
      default:
        throw new Error(); // Unreachable.
    }
  }
}

export function round(v: number): number {
  return Math.round(v * 10) / 10;
}
