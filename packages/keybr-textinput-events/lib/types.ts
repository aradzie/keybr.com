import { type CodePoint } from "@keybr/unicode";

export type InputListener = {
  readonly onKeyDown: (event: IKeyboardEvent) => void;
  readonly onKeyUp: (event: IKeyboardEvent) => void;
  readonly onInput: (event: IInputEvent) => void;
};

export type IKeyboardEvent = {
  readonly type: "keydown" | "keyup";
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

export type IInputEvent = {
  readonly type: "input";
  readonly timeStamp: number;
  readonly inputType:
    | "appendChar"
    | "appendLineBreak"
    | "clearChar"
    | "clearWord";
  readonly codePoint: CodePoint;
  readonly timeToType: number;
};
