import { type KeyShape } from "@keybr/keyboard";
import { type FunctionComponent, memo, type ReactNode } from "react";
import { keyGap, keySize } from "./constants.ts";
import * as styles from "./Key.module.less";
import {
  type KeyProps,
  keySymbol,
  keyTemplate,
  Primary,
  Secondary,
  Symbol,
} from "./Key.tsx";

/* eslint-disable react/jsx-key */
const standard = new Map<string, ReactNode>([
  ["Backspace", <Symbol x={10} y={25} text="Backspace" />],
  ["Tab", <Symbol x={10} y={25} text="Tab" />],
  ["CapsLock", <Symbol x={10} y={25} text="Caps Lock" />],
  ["Enter", <Symbol x={10} y={25} text="Enter" />],
  ["ShiftLeft", <Symbol x={10} y={25} text="Shift" />],
  ["ShiftRight", <Symbol x={10} y={25} text="Shift" />],
  ["ControlLeft", <Symbol x={10} y={25} text="Ctrl" />],
  ["ControlRight", <Symbol x={10} y={25} text="Ctrl" />],
  ["AltLeft", <Symbol x={10} y={25} text="Alt" />],
  ["AltRight", <Symbol x={10} y={25} text="Alt" />],
  ["Insert", <Symbol x={5} y={16} text="Insert" />],
  ["Home", <Symbol x={5} y={16} text="Home" />],
  [
    "PageUp",
    <>
      <Symbol x={5} y={16} text="Page" />
      <Symbol x={5} y={28} text="Up" />
    </>,
  ],
  ["Delete", <Symbol x={5} y={16} text="End" />],
  ["End", <Symbol x={5} y={16} text="End" />],
  [
    "PageDown",
    <>
      <Symbol x={5} y={16} text="Page" />
      <Symbol x={5} y={28} text="Down" />
    </>,
  ],
  ["ArrowUp", <Primary x={20} y={25} text={"\u2191"} textAnchor="middle" />],
  ["ArrowDown", <Primary x={20} y={25} text={"\u2193"} textAnchor="middle" />],
  ["ArrowLeft", <Primary x={20} y={25} text={"\u2190"} textAnchor="middle" />],
  ["ArrowRight", <Primary x={20} y={25} text={"\u2192"} textAnchor="middle" />],
  [
    "NumLock",
    <>
      <Symbol x={5} y={16} text="Num" />
      <Symbol x={5} y={28} text="Lock" />
    </>,
  ],
  ["NumpadDivide", <Primary x={10} y={25} text={"\u2044"} />],
  ["NumpadMultiply", <Primary x={10} y={25} text={"\u00D7"} />],
  ["NumpadSubtract", <Primary x={10} y={25} text={"\u2212"} />],
  [
    "Numpad7",
    <>
      <Primary x={8} y={18} text="7" />
      <Symbol x={35} y={32} text="Home" textAnchor="end" />
    </>,
  ],
  [
    "Numpad8",
    <>
      <Primary x={8} y={18} text="8" />
      <Symbol x={35} y={32} text={"\u2191"} textAnchor="end" />
    </>,
  ],
  [
    "Numpad9",
    <>
      <Primary x={8} y={18} text="9" />
      <Symbol x={35} y={32} text="Pg Up" textAnchor="end" />
    </>,
  ],
  ["NumpadAdd", <Primary x={10} y={25} text="+" />],
  [
    "Numpad4",
    <>
      <Primary x={8} y={18} text="4" />
      <Symbol x={35} y={32} text={"\u2190"} textAnchor="end" />
    </>,
  ],
  [
    "Numpad5",
    <>
      <Primary x={8} y={18} text="5" />
    </>,
  ],
  [
    "Numpad6",
    <>
      <Primary x={8} y={18} text="6" />
      <Symbol x={35} y={32} text={"\u2192"} textAnchor="end" />
    </>,
  ],
  [
    "Numpad1",
    <>
      <Primary x={8} y={18} text="1" />
      <Symbol x={35} y={32} text="End" textAnchor="end" />
    </>,
  ],
  [
    "Numpad2",
    <>
      <Primary x={8} y={18} text="2" />
      <Symbol x={35} y={32} text={"\u2193"} textAnchor="end" />
    </>,
  ],
  [
    "Numpad3",
    <>
      <Primary x={8} y={18} text="3" />
      <Symbol x={35} y={32} text="Pg Dn" textAnchor="end" />
    </>,
  ],
  ["NumpadEnter", <Symbol x={5} y={16} text="Enter" />],
  [
    "Numpad0",
    <>
      <Primary x={8} y={18} text="0" />
      <Symbol x={77} y={32} text="Ins" textAnchor="end" />
    </>,
  ],
  [
    "NumpadDecimal",
    <>
      <Primary x={8} y={18} text="." />
      <Symbol x={35} y={32} text="Del" textAnchor="end" />
    </>,
  ],
]);
/* eslint-enable react/jsx-key */

export function makeKeyComponent(shape: KeyShape): FunctionComponent<KeyProps> {
  const children = standard.get(shape.id);
  if (children == null) {
    return memo(makeCharacterKey(shape));
  } else {
    return memo(makeStandardKey(shape, children));
  }
}

function makeCharacterKey(shape: KeyShape): FunctionComponent<KeyProps> {
  const { a, b, c, d } = shape;
  const ab = a > 0 && b > 0 && keySymbol(a) === keySymbol(b);
  const cd = c > 0 && d > 0 && keySymbol(c) === keySymbol(d);
  const children = [
    b > 0 && !ab && <Secondary x={10} y={15} codePoint={b} />,
    a > 0 && !ab && <Secondary x={10} y={30} codePoint={a} />,
    d > 0 && !cd && <Secondary x={28} y={15} codePoint={d} />,
    c > 0 && !cd && <Secondary x={28} y={30} codePoint={c} />,
    a > 0 && ab && <Primary x={10} y={25} codePoint={a} />,
    c > 0 && cd && <Primary x={28} y={30} codePoint={c} />,
  ].filter(Boolean);
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
      {shape.features.includes("homing") ? (
        <circle className={styles.bump} cx={20} cy={33} r={3} />
      ) : null}
    </>,
  );
}

function makeStandardKey(
  shape: KeyShape,
  children: ReactNode,
): FunctionComponent<KeyProps> {
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
      {children}
      {shape.features.includes("homing") ? (
        <circle className={styles.bump} cx={20} cy={33} r={3} />
      ) : null}
    </>,
  );
}
