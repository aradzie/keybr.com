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
  showZones = false,
}: {
  readonly depressedKeys?: KeyIdList;
  readonly showZones?: boolean;
}): ReactNode {
  const keyboard = useKeyboard();
  const children = useMemo(() => getKeyElements(keyboard), [keyboard]);
  return (
    <svg x={21} y={21}>
      {children.map((child) => child.select(depressedKeys, showZones))}
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

  constructor(readonly keyboardKey: KeyboardKey) {
    const Component = getKeyComponent(keyboardKey.geometry.shape);
    this.component = Component;
    this.state0 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={false}
        showZones={false}
      />
    );
    this.state1 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={true}
        showZones={false}
      />
    );
    this.state2 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={false}
        showZones={true}
      />
    );
    this.state3 = (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={true}
        showZones={true}
      />
    );
  }

  select(depressedKeys: KeyIdList, showZones: boolean): ReactElement<KeyProps> {
    const { keyboardKey, component: Component } = this;
    const depressed = depressedKeys.includes(keyboardKey.id);
    if (!depressed && !showZones) {
      return this.state0;
    }
    if (depressed && !showZones) {
      return this.state1;
    }
    if (!depressed && showZones) {
      return this.state2;
    }
    if (depressed && showZones) {
      return this.state3;
    }
    return (
      <Component
        key={keyboardKey.id}
        keyboardKey={keyboardKey}
        depressed={depressed}
        showZones={showZones}
      />
    );
  }
}
