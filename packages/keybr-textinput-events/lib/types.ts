import { type Layout } from "@keybr/layout";

export type LayoutSettings = {
  readonly layout: Layout;
  readonly emulateLayout: boolean;
};

export type KeyEventListener = {
  readonly onKeyDown: (event: KeyEvent) => void;
  readonly onKeyUp: (event: KeyEvent) => void;
  readonly onInput: (codePoint: number, timeStamp: number) => void;
};

export type KeyEvent = {
  readonly timeStamp: number;
  readonly code: string;
  readonly key: string;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly location: number;
  readonly repeat: boolean;
};
