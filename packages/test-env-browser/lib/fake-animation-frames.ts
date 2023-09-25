import { type DOMWindow } from "jsdom";

export function polyfillAnimationFrames(window: DOMWindow): void {
  const callbacks = new Map<number, FrameRequestCallback>();
  let id = 1;
  window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
    const callbackId = id++;
    callbacks.set(callbackId, callback);
    setImmediate(() => {
      const callback = callbacks.get(callbackId);
      if (callback != null) {
        callbacks.delete(callbackId);
        callback(performance.now());
      }
    });
    return callbackId;
  };
  window.cancelAnimationFrame = (callbackId: number): void => {
    callbacks.delete(callbackId);
  };
  window.flushAnimationFrames = async (): Promise<void> => {
    while (callbacks.size > 0) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        });
      });
    }
  };
}
