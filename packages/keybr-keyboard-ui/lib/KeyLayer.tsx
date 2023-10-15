import {
  type Keyboard,
  type KeyboardKey,
  useKeyboard,
  visualSortKeys,
} from "@keybr/keyboard";
import {
  type ComponentType,
  memo,
  type ReactElement,
  type ReactNode,
  useMemo,
} from "react";
import { type KeyProps } from "./Key.tsx";
import { getKeyComponent } from "./keys.tsx";

type KeyId = string;
type KeyIdList = readonly KeyId[];

export function addKey(keys: KeyIdList, key: KeyId): KeyIdList {
  const index = keys.indexOf(key);
  if (index === -1) {
    keys = [...keys, key];
  }
  return keys;
}

export function deleteKey(keys: KeyIdList, key: KeyId): KeyIdList {
  const index = keys.indexOf(key);
  if (index !== -1) {
    keys = keys.filter((item) => item !== key);
  }
  return keys;
}

export const KeyLayer = memo(function KeyLayer({
  depressedKeys = [],
  toggledKeys = [],
  showColors = false,
}: {
  readonly depressedKeys?: KeyIdList;
  readonly toggledKeys?: KeyIdList;
  readonly showColors?: boolean;
}): ReactNode {
  const keyboard = useKeyboard();
  const children = useMemo(() => getKeyElements(keyboard), [keyboard]);
  return (
    <svg x={21} y={21}>
      {children.map((child) =>
        child.select(depressedKeys, toggledKeys, showColors),
      )}
    </svg>
  );
});

function getKeyElements(keyboard: Keyboard): MemoizedKeyElement[] {
  return [...keyboard.keys, ...keyboard.specialKeys, ...keyboard.extraKeys]
    .sort(visualSortKeys)
    .map((key) => new MemoizedKeyElement(key));
}

class MemoizedKeyElement {
  readonly component: ComponentType<KeyProps>;
  readonly state0: ReactElement<KeyProps>;
  readonly state1: ReactElement<KeyProps>;
  readonly state2: ReactElement<KeyProps>;
  readonly state3: ReactElement<KeyProps>;
  readonly state4: ReactElement<KeyProps>;
  readonly state5: ReactElement<KeyProps>;
  readonly state6: ReactElement<KeyProps>;
  readonly state7: ReactElement<KeyProps>;

  constructor(readonly keyboardKey: KeyboardKey) {
    const Component = getKeyComponent(keyboardKey.geometry.shape);
    this.component = Component;
    this.state0 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={false}
        toggled={false}
        showColors={false}
      />
    );
    this.state1 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={true}
        toggled={false}
        showColors={false}
      />
    );
    this.state2 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={false}
        toggled={true}
        showColors={false}
      />
    );
    this.state3 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={true}
        toggled={true}
        showColors={false}
      />
    );
    this.state4 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={false}
        toggled={false}
        showColors={true}
      />
    );
    this.state5 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={true}
        toggled={false}
        showColors={true}
      />
    );
    this.state6 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={false}
        toggled={true}
        showColors={true}
      />
    );
    this.state7 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={true}
        toggled={true}
        showColors={true}
      />
    );
  }

  select(
    depressedKeys: KeyIdList,
    toggledKeys: KeyIdList,
    showColors: boolean,
  ): ReactElement<KeyProps> {
    const { keyboardKey } = this;
    const depressed = depressedKeys.includes(keyboardKey.id);
    const toggled = toggledKeys.includes(keyboardKey.id);
    if (!showColors) {
      if (!toggled) {
        if (!depressed) {
          return this.state0;
        } else {
          return this.state1;
        }
      } else {
        if (!depressed) {
          return this.state2;
        } else {
          return this.state3;
        }
      }
    } else {
      if (!toggled) {
        if (!depressed) {
          return this.state4;
        } else {
          return this.state5;
        }
      } else {
        if (!depressed) {
          return this.state6;
        } else {
          return this.state7;
        }
      }
    }
  }
}
