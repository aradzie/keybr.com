import { type Graphics, Point } from "./svg.ts";

export const size = 100;
export const cellSize = size / 4;

type ShapeFunc = (graphics: Graphics) => void;

const borderShapeList: readonly ShapeFunc[] = [
  (graphics: Graphics): void => {
    graphics.addPolygon(
      triangle0(/* x= */ 0, /* y= */ 0, /* w= */ cellSize, /* h= */ cellSize),
    );
  },
  (graphics: Graphics): void => {
    graphics.addPolygon(
      triangle0(
        /* x= */ 0,
        /* y= */ 0,
        /* w= */ cellSize,
        /* h= */ cellSize / 2,
      ),
    );
  },
  (graphics: Graphics): void => {
    graphics.addPolygon(
      rhombus(/* x= */ 0, /* y= */ 0, /* w= */ cellSize, /* h= */ cellSize),
    );
  },
  (graphics: Graphics): void => {
    graphics.addCircle(
      /* x= */ cellSize / 10,
      /* y= */ cellSize / 10,
      /* diameter= */ cellSize - cellSize / 5,
    );
  },
];

const centerShapeList: readonly ShapeFunc[] = [
  (graphics: Graphics): void => {
    const k = cellSize * 0.42;
    graphics.addPolygon([
      new Point(0, 0),
      new Point(cellSize, 0),
      new Point(cellSize, cellSize - k * 2),
      new Point(cellSize - k, cellSize),
      new Point(0, cellSize),
    ]);
  },
  (graphics: Graphics): void => {
    const w = cellSize * 0.5;
    const h = cellSize * 0.8;
    graphics.addPolygon(
      triangle2(/* x= */ cellSize - w, /* y= */ 0, /* w= */ w, /* h= */ h),
    );
  },
  (graphics: Graphics): void => {
    const w = cellSize / 3;
    graphics.addPolygon(
      rectangle(
        /* x= */ w,
        /* y= */ w,
        /* w= */ cellSize - w,
        /* h= */ cellSize - w,
      ),
    );
  },
  (graphics: Graphics): void => {
    const outer = cellSize * 0.25;
    const inner = cellSize * 0.1;
    graphics.addPolygon(
      rectangle(
        /* x= */ outer,
        /* y= */ outer,
        /* w= */ cellSize - inner - outer,
        /* h= */ cellSize - inner - outer,
      ),
    );
  },
  (graphics: Graphics): void => {
    const m = cellSize * 0.15;
    const w = cellSize * 0.5;
    graphics.addCircle(
      /* x= */ cellSize - w - m,
      /* y= */ cellSize - w - m,
      /* diameter= */ w,
    );
  },
  (graphics: Graphics): void => {
    const outer = cellSize * 0.4;
    const inner = cellSize * 0.1;
    graphics.addPolygon(
      rectangle(/* x= */ 0, /* y= */ 0, /* w= */ cellSize, /* h= */ cellSize),
    );
    graphics.addPolygon(
      [
        new Point(outer, outer),
        new Point(cellSize - inner, outer),
        new Point(outer + (cellSize - outer - inner) / 2, cellSize - inner),
      ],
      /* invert= */ true,
    );
  },
  (graphics: Graphics): void => {
    graphics.addPolygon([
      new Point(0, 0),
      new Point(cellSize, 0),
      new Point(cellSize, cellSize * 0.7),
      new Point(cellSize * 0.4, cellSize * 0.4),
      new Point(cellSize * 0.7, cellSize),
      new Point(0, cellSize),
    ]);
  },
  (graphics: Graphics): void => {
    graphics.addPolygon(
      triangle3(
        /* x= */ cellSize / 2,
        /* y= */ cellSize / 2,
        /* w= */ cellSize / 2,
        /* h= */ cellSize / 2,
      ),
    );
  },
  (graphics: Graphics): void => {
    graphics.addPolygon(
      rectangle(
        /* x= */ 0,
        /* y= */ 0,
        /* w= */ cellSize,
        /* h= */ cellSize / 2,
      ),
    );
    graphics.addPolygon(
      rectangle(
        /* x= */ 0,
        /* y= */ cellSize / 2,
        /* w= */ cellSize / 2,
        /* h= */ cellSize / 2,
      ),
    );
    graphics.addPolygon(
      triangle1(
        /* x= */ cellSize / 2,
        /* y= */ cellSize / 2,
        /* w= */ cellSize / 2,
        /* h= */ cellSize / 2,
      ),
    );
  },
  (graphics: Graphics): void => {
    const outer = cellSize * 0.35;
    const inner = cellSize * 0.14;
    graphics.addPolygon(
      rectangle(/* x= */ 0, /* y= */ 0, /* w= */ cellSize, /* h= */ cellSize),
    );
    graphics.addPolygon(
      rectangle(
        /* x= */ outer,
        /* y= */ outer,
        /* w= */ cellSize - outer - inner,
        /* h= */ cellSize - outer - inner,
      ),
      true,
    );
  },
  (graphics: Graphics): void => {
    const outer = cellSize * 0.36;
    const inner = cellSize * 0.12;
    graphics.addPolygon(
      rectangle(/* x= */ 0, /* y= */ 0, /* w= */ cellSize, /* h= */ cellSize),
    );
    graphics.addCircle(
      /* x= */ outer,
      /* y= */ outer,
      /* diameter= */ cellSize - inner - outer,
      /* invert= */ true,
    );
  },
  (graphics: Graphics): void => {
    graphics.addPolygon(
      rectangle(/* x= */ 0, /* y= */ 0, /* w= */ cellSize, /* h= */ cellSize),
    );
    graphics.addPolygon(
      rhombus(
        /* x= */ cellSize * 0.25,
        /* y= */ cellSize * 0.25,
        /* w= */ cellSize - cellSize * 0.25,
        /* h= */ cellSize - cellSize * 0.25,
      ),
      true,
    );
  },
];

function rectangle(x: number, y: number, w: number, h: number): Point[] {
  return [
    new Point(x, y), // top left
    new Point(x + w, y), // top right
    new Point(x + w, y + h), // bottom right
    new Point(x, y + h), // bottom left
  ];
}

function rhombus(x: number, y: number, w: number, h: number): Point[] {
  return [
    new Point(x + w / 2, y), // top
    new Point(x + w, y + h / 2), // right
    new Point(x + w / 2, y + h), // bottom
    new Point(x, y + h / 2), // left
  ];
}

function triangle0(x: number, y: number, w: number, h: number) {
  // top left corner
  return [
    new Point(x, y + h), // bottom left
    new Point(x, y), // top left
    new Point(x + w, y), // top right
  ];
}

function triangle1(x: number, y: number, w: number, h: number) {
  // top right corner
  return [
    new Point(x, y), // top left
    new Point(x + w, y), // top right
    new Point(x + w, y + h), // bottom right
  ];
}

function triangle2(x: number, y: number, w: number, h: number) {
  // bottom right corner
  return [
    new Point(x + w, y), // top right
    new Point(x + w, y + h), // bottom right
    new Point(x, y + h), // bottom left
  ];
}

function triangle3(x: number, y: number, w: number, h: number) {
  // bottom left corner
  return [
    new Point(x + w, y + h), // bottom right
    new Point(x, y + h), // bottom left
    new Point(x, y), // top left
  ];
}

function pick<T>(list: readonly T[], index: number): T {
  return list[index % list.length];
}

export function borderShapes(graphics: Graphics, shapeIndex: number): void {
  pick(borderShapeList, shapeIndex)(graphics);
}

export function centerShapes(graphics: Graphics, shapeIndex: number): void {
  pick(centerShapeList, shapeIndex)(graphics);
}
