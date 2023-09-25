// Safari is the new IE.

// eslint-disable-next-line
interface Element {
  webkitRequestFullscreen(): any;
}

// eslint-disable-next-line
interface Document {
  webkitExitFullscreen(): any;
  webkitFullscreenEnabled: boolean;
  webkitFullscreenElement: Element | null;
}

export function installPolyfills() {
  fill(Element.prototype, "requestFullscreen", {
    value: function (this: Element): Promise<void> {
      if ("webkitRequestFullscreen" in this) {
        this.webkitRequestFullscreen();
        return Promise.resolve();
      } else {
        return Promise.reject("Not supported");
      }
    },
    configurable: true,
    enumerable: true,
    writable: true,
  });
  fill(Document.prototype, "exitFullscreen", {
    value: function (this: Document): Promise<void> {
      if ("webkitExitFullscreen" in this) {
        this.webkitExitFullscreen();
        return Promise.resolve();
      } else {
        return Promise.reject("Not supported");
      }
    },
    configurable: true,
    enumerable: true,
    writable: true,
  });
  fill(Document.prototype, "fullscreenEnabled", {
    get: function (this: Document): boolean {
      if ("webkitFullscreenEnabled" in this) {
        return this.webkitFullscreenEnabled;
      } else {
        return false;
      }
    },
    configurable: true,
    enumerable: true,
  });
  fill(Document.prototype, "fullscreenElement", {
    get: function (this: Document): Element | null {
      if ("webkitFullscreenElement" in this) {
        return this.webkitFullscreenElement;
      } else {
        return null;
      }
    },
    configurable: true,
    enumerable: true,
  });
  listen({ onwebkitfullscreenchange: "webkitfullscreenchange" }, onChange);
  listen({ onwebkitfullscreenerror: "webkitfullscreenerror" }, onError);
}

function fill(target: any, name: string, descriptor: PropertyDescriptor) {
  if (!(name in target)) {
    Object.defineProperty(target, name, descriptor);
  }
}

function listen(map: any, listener: (event: Event) => void) {
  for (const key of Object.keys(map)) {
    if (key in document) {
      const value = map[key];
      document.addEventListener(value, listener);
      break;
    }
  }
}

function onChange(): void {
  document.dispatchEvent(newEvent("fullscreenchange", true, false));
}

function onError(): void {
  document.dispatchEvent(newEvent("fullscreenerror", true, false));
}

function newEvent(type: string, bubbles: boolean, cancelable: boolean): Event {
  const event = document.createEvent("Event");
  event.initEvent(type, bubbles, cancelable);
  return event;
}
