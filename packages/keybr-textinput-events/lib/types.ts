import { type CodePoint } from "@keybr/unicode";

export type TextInputListener = {
  readonly onKeyDown: (event: KeyEvent) => void;
  readonly onKeyUp: (event: KeyEvent) => void;
  readonly onTextInput: (event: TextInputEvent) => void;
};

export type KeyEvent = {
  readonly timeStamp: number;
  readonly code: string;
  readonly key: string;
  readonly modifiers: readonly ModifierId[];
};

export type ModifierId =
  | "CapsLock"
  | "NumLock"
  | "Control"
  | "Shift"
  | "Alt"
  | "AltGraph"
  | "Meta";

export type TextInputEvent = {
  readonly timeStamp: number;
  readonly inputType:
    | "appendChar"
    | "appendLineBreak"
    | "clearChar"
    | "clearWord";
  readonly codePoint: CodePoint;
  readonly timeToType: number;
};
