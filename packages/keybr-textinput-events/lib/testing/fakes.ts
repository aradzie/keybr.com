import {
  type KeyEvent,
  type TextInputEvent,
  type TextInputListener,
} from "../types.ts";

class FakeEvent {
  readonly isTrusted: boolean = true;
  defaultPrevented: boolean = false;

  constructor(
    readonly type: string,
    readonly timeStamp: number,
  ) {}

  preventDefault(): void {
    this.defaultPrevented = true;
  }
}

export function makeFakeKeyboardEvent({
  type,
  timeStamp = 0,
  code,
  key,
  shiftKey = false,
  altKey = false,
  ctrlKey = false,
  metaKey = false,
  location = 0,
  repeat = false,
  modifiers = [],
}: {
  type: "keydown" | "keyup";
  timeStamp?: number;
  code: string;
  key: string;
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  location?: number;
  repeat?: boolean;
  modifiers?: readonly string[];
}) {
  return new (class FakeKeyboardEvent extends FakeEvent {
    readonly code = code;
    readonly key = key;
    readonly shiftKey = shiftKey;
    readonly altKey = altKey;
    readonly ctrlKey = ctrlKey;
    readonly metaKey = metaKey;
    readonly location = location;
    readonly repeat = repeat;

    getModifierState(modifier: string): boolean {
      return modifiers.includes(modifier);
    }

    constructor() {
      super(type, timeStamp);
    }
  })();
}

export function makeFakeInputEvent({
  type,
  timeStamp = 0,
  inputType,
  data = null,
}: {
  type: "beforeinput" | "input";
  timeStamp?: number;
  inputType: string;
  data?: string | null;
}) {
  return new (class FakeInputEvent extends FakeEvent {
    readonly inputType = inputType;
    readonly data = data;

    constructor() {
      super(type, timeStamp);
    }
  })();
}

export function makeFakeCompositionEvent({
  type,
  timeStamp = 0,
  data,
}: {
  type: "compositionstart" | "compositionupdate" | "compositionend";
  timeStamp?: number;
  data: string;
}) {
  return new (class FakeInputEvent extends FakeEvent {
    readonly data = data;

    constructor() {
      super(type, timeStamp);
    }
  })();
}

export function tracingListener(trace: string[]): TextInputListener {
  return new (class implements TextInputListener {
    onKeyDown = ({ code, key, timeStamp }: KeyEvent): void => {
      trace.push(`keydown:${code},${key},${timeStamp}`);
    };
    onKeyUp = ({ code, key, timeStamp }: KeyEvent): void => {
      trace.push(`keyup:${code},${key},${timeStamp}`);
    };
    onTextInput = ({
      inputType,
      codePoint,
      timeStamp,
    }: TextInputEvent): void => {
      trace.push(
        `${inputType}:${String.fromCodePoint(codePoint)},${timeStamp}`,
      );
    };
  })();
}
