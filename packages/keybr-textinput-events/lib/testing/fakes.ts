import {
  type KeyEvent,
  type ModifierId,
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

  preventDefault() {
    this.defaultPrevented = true;
  }
}

export function fakeKeyboardEvent({
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
  modifiers?: readonly ModifierId[];
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
      return modifiers.includes(modifier as ModifierId);
    }

    constructor() {
      super(type, timeStamp);
    }
  })() as KeyboardEvent & FakeEvent;
}

export function fakeInputEvent({
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
  })() as InputEvent & FakeEvent;
}

export function fakeCompositionEvent({
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
  })() as CompositionEvent & FakeEvent;
}

export function tracingListener() {
  return new (class implements TextInputListener {
    readonly trace: string[] = [];
    onKeyDown = ({ timeStamp, code, key }: KeyEvent) => {
      this.trace.push([timeStamp, "keydown", code, key].join(","));
    };
    onKeyUp = ({ timeStamp, code, key }: KeyEvent) => {
      this.trace.push([timeStamp, "keyup", code, key].join(","));
    };
    onTextInput = ({
      timeStamp,
      inputType,
      codePoint,
      timeToType,
    }: TextInputEvent) => {
      this.trace.push(
        [
          timeStamp,
          inputType,
          String.fromCodePoint(codePoint),
          timeToType,
        ].join(","),
      );
    };
  })();
}
