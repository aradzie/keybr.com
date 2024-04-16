export const CLOSE_CODES = {
  CLOSE_NORMAL: 1000,
  CLOSE_GOING_AWAY: 1001,
  CLOSE_PROTOCOL_ERROR: 1002,
  CLOSE_UNSUPPORTED: 1003,
  CLOSE_NO_STATUS: 1005,
  CLOSE_ABNORMAL: 1006,
  UNSUPPORTED_DATA: 1007,
  POLICY_VIOLATION: 1008,
  CLOSE_TOO_LARGE: 1009,
  MISSING_EXTENSION: 1010,
  INTERNAL_ERROR: 1011,
  SERVICE_RESTART: 1012,
  TRY_AGAIN_LATER: 1013,
  TLS_HANDSHAKE: 1015,
};

export class FakeEventTarget implements EventTarget {
  readonly #listeners: {
    [name: string]: EventListenerOrEventListenerObject[];
  } = {};

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    capture?: boolean | AddEventListenerOptions,
  ): void {
    let listeners = this.#listeners[type];
    if (listeners == null) {
      listeners = this.#listeners[type] = [];
    }
    if (listener != null) {
      listeners.push(listener as EventListener);
    }
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    capture?: boolean | AddEventListenerOptions,
  ): void {
    if (listener != null) {
      const listeners = this.#listeners[type];
      if (listeners != null) {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this.#listeners[event.type];
    if (listeners != null) {
      for (const listener of listeners) {
        if (typeof listener === "function") {
          listener.call(this, event);
        } else {
          throw new TypeError();
        }
      }
    }
    return true;
  }
}

export class FakeEvent implements Event {
  static NONE = 0 as const;
  static CAPTURING_PHASE = 1 as const;
  static AT_TARGET = 2 as const;
  static BUBBLING_PHASE = 3 as const;

  NONE = FakeEvent.NONE;
  CAPTURING_PHASE = FakeEvent.CAPTURING_PHASE;
  AT_TARGET = FakeEvent.AT_TARGET;
  BUBBLING_PHASE = FakeEvent.BUBBLING_PHASE;

  bubbles!: boolean;
  cancelable!: boolean;
  cancelBubble!: boolean;
  composed!: boolean;

  currentTarget!: EventTarget;
  defaultPrevented!: boolean;
  eventPhase!: number;
  isTrusted!: boolean;
  returnValue!: boolean;
  scoped!: boolean;
  srcElement!: Element | null;
  target!: EventTarget;
  timeStamp!: number;
  type!: string;

  constructor(type: string, bubbles: boolean, cancelable: boolean) {
    this.initEvent(type, bubbles, cancelable);
  }

  initEvent(type: string, canBubble: boolean, cancelable: boolean): void {
    this.type = type;
    this.bubbles = canBubble;
    this.cancelable = cancelable;
  }

  stopPropagation(): void {}

  stopImmediatePropagation(): void {}

  preventDefault(): void {}

  composedPath(): EventTarget[] {
    return [];
  }
}

export class FakeCloseEvent extends FakeEvent implements CloseEvent {
  wasClean!: boolean;
  code!: number;
  reason!: string;

  constructor(
    wasClean: boolean = true,
    code: number = CLOSE_CODES.CLOSE_NORMAL,
    reason: string = "",
  ) {
    super("close", true, false);
    this.initCloseEvent("close", true, false, wasClean, code, reason);
  }

  initCloseEvent(
    type: string,
    canBubble: boolean,
    cancelable: boolean,
    wasClean: boolean,
    code: number,
    reason: string,
  ): void {
    this.initEvent(type, canBubble, cancelable);
    this.wasClean = wasClean;
    this.code = code;
    this.reason = reason;
  }
}

export class FakeMessageEvent extends FakeEvent implements MessageEvent {
  data!: any;
  lastEventId!: string;
  origin!: string;
  ports!: readonly MessagePort[];
  source!: Window;

  constructor(data: any) {
    super("message", true, false);
    this.initMessageEvent("message", true, false, data, "", "", window);
  }

  initMessageEvent(
    type: string,
    canBubble: boolean,
    cancelable: boolean,
    data: any,
    lastEventId: string,
    origin: string,
    source: Window,
  ): void {
    this.initEvent(type, canBubble, cancelable);
    this.data = data;
    this.lastEventId = lastEventId;
    this.origin = origin;
    this.source = source;
  }
}

export class FakeWebSocket extends FakeEventTarget implements WebSocket {
  static CONNECTING = 0 as const;
  static OPEN = 1 as const;
  static CLOSING = 2 as const;
  static CLOSED = 3 as const;

  CONNECTING = FakeWebSocket.CONNECTING;
  OPEN = FakeWebSocket.OPEN;
  CLOSING = FakeWebSocket.CLOSING;
  CLOSED = FakeWebSocket.CLOSED;

  url: string;
  protocol: string;
  extensions: string;
  readyState: number;
  binaryType: BinaryType;
  bufferedAmount: number;

  sent: any[] = [];
  lastSent: any | null = null;

  constructor(url: string) {
    super();
    if (url == null) {
      throw new TypeError();
    }
    this.url = url;
    this.protocol = "";
    this.extensions = "";
    this.readyState = FakeWebSocket.CONNECTING;
    this.binaryType = "blob";
    this.bufferedAmount = 0;
  }

  set onopen(handler: (this: WebSocket, ev: Event) => any) {
    this.addEventListener("open", handler as EventListener);
  }

  set onclose(handler: (this: WebSocket, event: CloseEvent) => any) {
    this.addEventListener("close", handler as EventListener);
  }

  set onmessage(handler: (this: WebSocket, ev: MessageEvent) => any) {
    this.addEventListener("message", handler as EventListener);
  }

  set onerror(handler: (this: WebSocket, ev: Event) => any) {
    this.addEventListener("error", handler as EventListener);
  }

  send(data: any): void {
    if (this.readyState === FakeWebSocket.OPEN) {
      this.sent.push((this.lastSent = data));
    } else {
      throw new Error();
    }
  }

  close(code?: number, reason?: string): void {
    if (this.readyState === FakeWebSocket.OPEN) {
      this.readyState = FakeWebSocket.CLOSING;
      this.dispatchEvent(new FakeCloseEvent(true, code, reason));
      this.readyState = FakeWebSocket.CLOSED;
    }
  }

  serverConnect(): void {
    if (this.readyState === FakeWebSocket.CONNECTING) {
      this.readyState = FakeWebSocket.OPEN;
      this.dispatchEvent(new FakeEvent("open", true, false));
    } else {
      throw new Error();
    }
  }

  serverSend(data: any): void {
    if (this.readyState === FakeWebSocket.OPEN) {
      this.dispatchEvent(new FakeMessageEvent(data));
    } else {
      throw new Error();
    }
  }

  serverClose(code?: number, reason?: string): void {
    if (this.readyState === FakeWebSocket.OPEN) {
      this.dispatchEvent(new FakeCloseEvent(true, code, reason));
    } else {
      throw new Error();
    }
  }
}
