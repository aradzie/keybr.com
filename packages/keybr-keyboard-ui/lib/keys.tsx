import { type FunctionComponent, type ReactNode } from "react";
import * as styles from "./Key.module.less";
import {
  Key,
  type KeyProps,
  keySymbol,
  Label,
  Primary,
  Secondary,
  SpecialKey,
} from "./Key.tsx";

const key = (props: KeyProps): ReactNode => {
  const {
    keyboardKey: {
      codePoints: { a, b, c, d },
    },
  } = props;
  const ab = a > 0 && b > 0 && keySymbol(a) === keySymbol(b);
  const cd = c > 0 && d > 0 && keySymbol(c) === keySymbol(d);
  return (
    <Key {...props}>
      <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
      {b > 0 && !ab && <Secondary x={10} y={15} codePoint={b} />}
      {a > 0 && !ab && <Secondary x={10} y={30} codePoint={a} />}
      {d > 0 && !cd && <Secondary x={28} y={15} codePoint={d} />}
      {c > 0 && !cd && <Secondary x={28} y={30} codePoint={c} />}
      {a > 0 && ab && <Primary x={15} y={25} codePoint={a} />}
      {c > 0 && cd && <Primary x={28} y={30} codePoint={c} />}
    </Key>
  );
};
const keyF = (props: KeyProps): ReactNode => {
  const {
    keyboardKey: {
      codePoints: { a, b, c, d },
    },
  } = props;
  const ab = a > 0 && b > 0 && keySymbol(a) === keySymbol(b);
  const cd = c > 0 && d > 0 && keySymbol(c) === keySymbol(d);
  return (
    <Key {...props}>
      <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
      <circle className={styles.keyBump} cx={20} cy={35} r={3} />
      {b > 0 && !ab && <Secondary x={10} y={15} codePoint={b} />}
      {a > 0 && !ab && <Secondary x={10} y={30} codePoint={a} />}
      {d > 0 && !cd && <Secondary x={28} y={15} codePoint={d} />}
      {c > 0 && !cd && <Secondary x={28} y={30} codePoint={c} />}
      {a > 0 && ab && <Primary x={15} y={25} codePoint={a} />}
      {c > 0 && cd && <Primary x={28} y={30} codePoint={c} />}
    </Key>
  );
};
const keyJ = (props: KeyProps): ReactNode => {
  const {
    keyboardKey: {
      codePoints: { a, b, c, d },
    },
  } = props;
  const ab = a > 0 && b > 0 && keySymbol(a) === keySymbol(b);
  const cd = c > 0 && d > 0 && keySymbol(c) === keySymbol(d);
  return (
    <Key {...props}>
      <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
      <circle className={styles.keyBump} cx={20} cy={35} r={3} />
      {b > 0 && !ab && <Secondary x={10} y={15} codePoint={b} />}
      {a > 0 && !ab && <Secondary x={10} y={30} codePoint={a} />}
      {d > 0 && !cd && <Secondary x={28} y={15} codePoint={d} />}
      {c > 0 && !cd && <Secondary x={28} y={30} codePoint={c} />}
      {a > 0 && ab && <Primary x={15} y={25} codePoint={a} />}
      {c > 0 && cd && <Primary x={28} y={30} codePoint={c} />}
    </Key>
  );
};
const keyBackslash = (props: KeyProps): ReactNode => {
  const {
    keyboardKey: {
      codePoints: { a, b, c, d },
    },
  } = props;
  const ab = a > 0 && b > 0 && keySymbol(a) === keySymbol(b);
  const cd = c > 0 && d > 0 && keySymbol(c) === keySymbol(d);
  return (
    <Key {...props}>
      <rect className={styles.keyButton} x={0} y={0} width={60} height={40} />
      {b > 0 && !ab && <Secondary x={10} y={15} codePoint={b} />}
      {a > 0 && !ab && <Secondary x={10} y={30} codePoint={a} />}
      {d > 0 && !cd && <Secondary x={28} y={15} codePoint={d} />}
      {c > 0 && !cd && <Secondary x={28} y={30} codePoint={c} />}
      {a > 0 && ab && <Primary x={15} y={25} codePoint={a} />}
      {c > 0 && cd && <Primary x={28} y={30} codePoint={c} />}
    </Key>
  );
};
const keyLeftShift = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={92} height={40} />
    <Label x={15} y={25} text="Shift" />
  </SpecialKey>
);
const keyLeftShiftStandard102 = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={50} height={40} />
    <Label x={15} y={25} text="Shift" />
  </SpecialKey>
);
const keyRightShift = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={115} height={40} />
    <Label x={15} y={25} text="Shift" />
  </SpecialKey>
);
const keyCtrl = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={63} height={40} />
    <Label x={15} y={25} text="Ctrl" />
  </SpecialKey>
);
const keyAlt = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={63} height={40} />
    <Label x={15} y={25} text="Alt" />
  </SpecialKey>
);
const keyAltGr = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={63} height={40} />
    <Label x={15} y={25} text="Alt Gr" />
  </SpecialKey>
);
const keyTab = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={63} height={40} />
    <Label x={15} y={25} text="Tab" />
  </SpecialKey>
);
const keyCapsLock = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={70} height={40} />
    <Label x={15} y={25} text="Caps Lock" />
  </SpecialKey>
);
const keyBackspace = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={83} height={40} />
    <Label x={15} y={25} text="Backspace" />
  </SpecialKey>
);
const keyEnter = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={95} height={40} />
    <Label x={15} y={25} text="Enter" />
  </SpecialKey>
);
const keyEnterStandard102 = (props: KeyProps): ReactNode => (
  <SpecialKey {...props}>
    <path className={styles.keyButton} d="m 0,0 0,40 7,0 0,42 53,0 0,-82 z" />
    <Label x={15} y={25} text="Enter" />
  </SpecialKey>
);
const keySpace = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={369} height={40} />
  </Key>
);
const keyHome = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Label x={5} y={16} text="Home" />
  </Key>
);
const keyEnd = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Label x={5} y={16} text="End" />
  </Key>
);
const keyInsert = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Label x={5} y={16} text="Insert" />
  </Key>
);
const keyDelete = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Label x={5} y={16} text="Delete" />
  </Key>
);
const keyPageUp = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Label x={5} y={16} text="Page" />
    <Label x={5} y={28} text="Up" />
  </Key>
);
const KeyPageDown = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Label x={5} y={16} text="Page" />
    <Label x={5} y={28} text="Down" />
  </Key>
);
const keyUp = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={20} y={25} text={"\u2191"} textAnchor="middle" />
  </Key>
);
const keyDown = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={20} y={25} text={"\u2193"} textAnchor="middle" />
  </Key>
);
const keyLeft = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={20} y={25} text={"\u2190"} textAnchor="middle" />
  </Key>
);
const keyRight = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={20} y={25} text={"\u2192"} textAnchor="middle" />
  </Key>
);
const keyNpNumLock = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Label x={5} y={16} text="Num" />
    <Label x={5} y={28} text="Lock" />
  </Key>
);
const keyNpDivide = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={15} y={25} text={"\u2044"} />
  </Key>
);
const keyNpMultiply = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={15} y={25} text={"\u00D7"} />
  </Key>
);
const keyNpSubtract = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={15} y={25} text={"\u2212"} />
  </Key>
);
const keyNpAdd = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={82} />
    <Primary x={15} y={25} text="+" />
  </Key>
);
const keyNpEnter = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={82} />
    <Label x={5} y={16} text="Enter" />
  </Key>
);
const keyNpDecimal = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="." />
    <Label x={35} y={32} text="Del" textAnchor="end" />
  </Key>
);
const keyNp0 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={82} height={40} />
    <Primary x={8} y={18} text="0" />
    <Label x={77} y={32} text="Ins" textAnchor="end" />
  </Key>
);
const keyNp1 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="1" />
    <Label x={35} y={32} text="End" textAnchor="end" />
  </Key>
);
const keyNp2 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="2" />
    <Label x={35} y={32} text={"\u2193"} textAnchor="end" />
  </Key>
);
const keyNp3 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="3" />
    <Label x={35} y={32} text="Pg Dn" textAnchor="end" />
  </Key>
);
const keyNp4 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="4" />
    <Label x={35} y={32} text={"\u2190"} textAnchor="end" />
  </Key>
);
const keyNp5 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="5" />
  </Key>
);
const keyNp6 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="6" />
    <Label x={35} y={32} text={"\u2192"} textAnchor="end" />
  </Key>
);
const keyNp7 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="7" />
    <Label x={35} y={32} text="Home" textAnchor="end" />
  </Key>
);
const keyNp8 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="8" />
    <Label x={35} y={32} text={"\u2191"} textAnchor="end" />
  </Key>
);
const keyNp9 = (props: KeyProps): ReactNode => (
  <Key {...props}>
    <rect className={styles.keyButton} x={0} y={0} width={40} height={40} />
    <Primary x={8} y={18} text="9" />
    <Label x={35} y={32} text="Pg Up" textAnchor="end" />
  </Key>
);

const keys = new Map<string, FunctionComponent<KeyProps>>([
  ["key", key],
  ["key-f", keyF],
  ["key-j", keyJ],
  ["key-backslash", keyBackslash],
  ["key-left-shift", keyLeftShift],
  ["key-left-shift-standard-102", keyLeftShiftStandard102],
  ["key-right-shift", keyRightShift],
  ["key-ctrl", keyCtrl],
  ["key-alt", keyAlt],
  ["key-alt-gr", keyAltGr],
  ["key-tab", keyTab],
  ["key-caps-lock", keyCapsLock],
  ["key-backspace", keyBackspace],
  ["key-enter", keyEnter],
  ["key-enter-standard-102", keyEnterStandard102],
  ["key-space", keySpace],
  ["key-home", keyHome],
  ["key-end", keyEnd],
  ["key-insert", keyInsert],
  ["key-delete", keyDelete],
  ["key-page-up", keyPageUp],
  ["key-page-down", KeyPageDown],
  ["key-up", keyUp],
  ["key-down", keyDown],
  ["key-left", keyLeft],
  ["key-right", keyRight],
  ["key-np-num-lock", keyNpNumLock],
  ["key-np-divide", keyNpDivide],
  ["key-np-multiply", keyNpMultiply],
  ["key-np-subtract", keyNpSubtract],
  ["key-np-add", keyNpAdd],
  ["key-np-enter", keyNpEnter],
  ["key-np-decimal", keyNpDecimal],
  ["key-np-0", keyNp0],
  ["key-np-1", keyNp1],
  ["key-np-2", keyNp2],
  ["key-np-3", keyNp3],
  ["key-np-4", keyNp4],
  ["key-np-5", keyNp5],
  ["key-np-6", keyNp6],
  ["key-np-7", keyNp7],
  ["key-np-8", keyNp8],
  ["key-np-9", keyNp9],
]);

for (const [id, component] of keys.entries()) {
  component.displayName = id;
}

export function getKeyComponent(shape: string): FunctionComponent<KeyProps> {
  const factory = keys.get(shape);
  if (factory != null) {
    return factory;
  } else {
    throw new Error(shape);
  }
}
