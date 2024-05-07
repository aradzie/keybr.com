import { hashCode, LCG, randomSamples } from "@keybr/rand";
import { type ClassName, type MouseProps } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { colors } from "./colors.ts";
import { borderShapes, cellSize, centerShapes, size } from "./shapes.ts";
import { Graphics, Path, Transform } from "./svg.ts";
import { initials } from "./util.ts";

export function Identicon({
  className,
  name,
  ...props
}: {
  readonly className?: ClassName;
  readonly name: string;
} & MouseProps): ReactNode {
  const random = LCG(hashCode(name));
  const palette = randomSamples(colors, 3, random);
  const text = initials(name);
  const makePath = (
    shapes: (graphics: Graphics, shapeIndex: number) => void,
    positions: readonly [x: number, y: number][],
  ): string => {
    const shapeIndex = (random() * 1000) | 0;
    let rotation = (random() * 1000) | 0;
    const path = new Path();
    for (const [x, y] of positions) {
      const transform = new Transform(
        cellSize * x,
        cellSize * y,
        cellSize,
        rotation++ % 4,
      );
      shapes(new Graphics(path, transform), shapeIndex);
    }
    return String(path);
  };

  return (
    <svg {...props} className={clsx(className)} viewBox={`0 0 ${size} ${size}`}>
      <path
        fill={palette[0]}
        d={makePath(borderShapes, [
          [1, 0],
          [2, 0],
          [2, 3],
          [1, 3],
          [0, 1],
          [3, 1],
          [3, 2],
          [0, 2],
        ])}
      />
      <path
        fill={palette[1]}
        d={makePath(borderShapes, [
          [0, 0],
          [3, 0],
          [3, 3],
          [0, 3],
        ])}
      />
      <path
        fill={palette[2]}
        d={makePath(centerShapes, [
          [1, 1],
          [2, 1],
          [2, 2],
          [1, 2],
        ])}
      />
      <circle cx={50} cy={50} r={40} fill="#ffffff" opacity={0.7} />
      <text
        x={50}
        y={50}
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={text.length === 1 ? 80 : text.length === 2 ? 60 : 40}
        fill="#000000"
      >
        {text}
      </text>
    </svg>
  );
}
