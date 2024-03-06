import { type KeyShape } from "@keybr/keyboard";
import { type FunctionComponent } from "react";
import { keyGap, keySize } from "./constants.ts";
import * as styles from "./Key.module.less";
import {
  type KeyProps,
  keySymbol,
  keyTemplate,
  Label,
  Primary,
  Secondary,
} from "./Key.tsx";

export function makeKeyComponent(shape: KeyShape): FunctionComponent<KeyProps> {
  const { a, b, c, d } = shape;
  const ab = a > 0 && b > 0 && keySymbol(a) === keySymbol(b);
  const cd = c > 0 && d > 0 && keySymbol(c) === keySymbol(d);
  const children = [];
  if (b > 0 && !ab) {
    children.push(<Secondary x={10} y={15} codePoint={b} />);
  }
  if (a > 0 && !ab) {
    children.push(<Secondary x={10} y={30} codePoint={a} />);
  }
  if (d > 0 && !cd) {
    children.push(<Secondary x={25} y={15} codePoint={d} />);
  }
  if (c > 0 && !cd) {
    children.push(<Secondary x={25} y={30} codePoint={c} />);
  }
  if (a > 0 && ab) {
    children.push(<Primary x={10} y={25} codePoint={a} />);
  }
  if (c > 0 && cd) {
    children.push(<Primary x={25} y={30} codePoint={c} />);
  }
  for (const label of shape.labels) {
    children.push(<Label label={label} />);
  }
  if (shape.homing) {
    children.push(<circle className={styles.bump} cx={20} cy={33} r={3} />);
  }
  return keyTemplate(
    shape,
    <>
      {shape.shape ? (
        <path className={styles.button} d={shape.shape} />
      ) : (
        <rect
          className={styles.button}
          x={0}
          y={0}
          width={shape.w * keySize - keyGap}
          height={shape.h * keySize - keyGap}
        />
      )}
      {...children}
    </>,
  );
}
