export type TextInputListener = {
  readonly onKeyDown: (event: KeyEvent) => void;
  readonly onKeyUp: (event: KeyEvent) => void;
  readonly onTextInput: (event: TextInputEvent) => void;
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

export type TextInputEvent = {
  readonly timeStamp: number;
  readonly inputType: "appendChar" | "clearChar" | "clearWord";
  readonly codePoint: number;
};

export type Focusable = {
  blur(): void;
  focus(): void;
};
