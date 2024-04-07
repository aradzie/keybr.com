import restrictedGlobals from "confusing-browser-globals";
import {
  IDBCursor,
  IDBCursorWithValue,
  IDBDatabase,
  IDBFactory,
  IDBIndex,
  IDBKeyRange,
  IDBObjectStore,
  IDBOpenDBRequest,
  IDBRequest,
  IDBTransaction,
  IDBVersionChangeEvent,
  indexedDB,
} from "fake-indexeddb";
import { JSDOM } from "jsdom";
import { FakeAnimation } from "./fake-animation.ts";
import { polyfillAnimationFrames } from "./fake-animation-frames.ts";
import { FakeCanvasRenderingContext2D } from "./fake-canvas.ts";
import { FakeResizeObserver } from "./fake-resize-observer.ts";

install(create(), global);

function create(): JSDOM {
  const jsdom = new JSDOM(undefined, {
    url: "https://www.keybr.com/",
    pretendToBeVisual: false, // Disable requestAnimationFrame.
  });
  polyfill(jsdom);
  return jsdom;
}

function polyfill(jsdom: JSDOM): void {
  const { window } = jsdom;
  window.indexedDB = indexedDB;
  window.IDBCursor = IDBCursor;
  window.IDBCursorWithValue = IDBCursorWithValue;
  window.IDBDatabase = IDBDatabase;
  window.IDBFactory = IDBFactory;
  window.IDBIndex = IDBIndex;
  window.IDBKeyRange = IDBKeyRange;
  window.IDBObjectStore = IDBObjectStore;
  window.IDBOpenDBRequest = IDBOpenDBRequest;
  window.IDBRequest = IDBRequest;
  window.IDBTransaction = IDBTransaction;
  window.IDBVersionChangeEvent = IDBVersionChangeEvent;
  window.HTMLElement.prototype.animate = function () {
    return new FakeAnimation();
  };
  window.HTMLCanvasElement.prototype.getContext = function () {
    return new FakeCanvasRenderingContext2D(this);
  };
  window.SVGElement.prototype.beginElement ??= function () {};
  window.SVGElement.prototype.beginElementAt ??= function () {};
  window.SVGElement.prototype.endElement ??= function () {};
  window.SVGElement.prototype.endElementAt ??= function () {};
  window.ResizeObserver = FakeResizeObserver;
  polyfillAnimationFrames(window);
}

function install(jsdom: JSDOM, scope: any): () => void {
  const { window } = jsdom;
  const scopeKeys = Object.getOwnPropertyNames(scope);
  const windowKeys = Object.getOwnPropertyNames(window);
  const keys = ["window", "document", "navigator"];
  for (const key of windowKeys) {
    if (
      !/^_/.test(key) && // Private fields.
      !/^on/.test(key) && // Event handlers.
      !keys.includes(key) &&
      !scopeKeys.includes(key) &&
      !restrictedGlobals.includes(key)
    ) {
      keys.push(key);
    }
  }
  for (const key of keys) {
    scope[key] = window[key];
  }
  return () => {
    for (const key of keys) {
      delete scope[key];
    }
  };
}
