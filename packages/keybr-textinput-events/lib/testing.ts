import {
  type IInputEvent,
  type IKeyboardEvent,
  type InputListener,
  type ModifierId,
} from "./types.ts";

export class FakeEvent {
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

export type FakeKeyboardEventInit = Readonly<{
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
}>;

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
}: FakeKeyboardEventInit) {
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

export type FakeInputEventInit = Readonly<{
  type: "beforeinput" | "input";
  timeStamp?: number;
  inputType: string;
  data?: string | null;
}>;

export function fakeInputEvent({
  type,
  timeStamp = 0,
  inputType,
  data = null,
}: FakeInputEventInit) {
  return new (class FakeInputEvent extends FakeEvent {
    readonly inputType = inputType;
    readonly data = data;

    constructor() {
      super(type, timeStamp);
    }
  })() as InputEvent & FakeEvent;
}

export type FakeCompositionEventInit = Readonly<{
  type: "compositionstart" | "compositionupdate" | "compositionend";
  timeStamp?: number;
  data: string;
}>;

export function fakeCompositionEvent({
  type,
  timeStamp = 0,
  data,
}: FakeCompositionEventInit) {
  return new (class FakeInputEvent extends FakeEvent {
    readonly data = data;

    constructor() {
      super(type, timeStamp);
    }
  })() as CompositionEvent & FakeEvent;
}

export type FakeEventInit =
  | FakeKeyboardEventInit
  | FakeInputEventInit
  | FakeCompositionEventInit;

export function fakeEvent(
  init: FakeKeyboardEventInit,
): ReturnType<typeof fakeKeyboardEvent>;
export function fakeEvent(
  init: FakeInputEventInit,
): ReturnType<typeof fakeInputEvent>;
export function fakeEvent(
  init: FakeCompositionEventInit,
): ReturnType<typeof fakeCompositionEvent>;
export function fakeEvent(init: FakeEventInit) {
  switch (init.type) {
    case "keydown":
    case "keyup":
      return fakeKeyboardEvent(init);
    case "beforeinput":
    case "input":
      return fakeInputEvent(init);
    case "compositionstart":
    case "compositionupdate":
    case "compositionend":
      return fakeCompositionEvent(init);
  }
}

export function tracingListener() {
  return new (class implements InputListener {
    readonly trace: string[] = [];
    onKeyDown = ({ timeStamp, type, code, key }: IKeyboardEvent) => {
      this.trace.push([timeStamp, type, code, key].join(","));
    };
    onKeyUp = ({ timeStamp, type, code, key }: IKeyboardEvent) => {
      this.trace.push([timeStamp, type, code, key].join(","));
    };
    onInput = ({
      timeStamp,
      inputType,
      codePoint,
      timeToType,
    }: IInputEvent) => {
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
