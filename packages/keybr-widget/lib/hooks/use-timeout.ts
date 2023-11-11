import { useEffect, useRef } from "react";

export const useTimeout0 = (callback: () => void, time: number): void => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    const id = setTimeout(() => {
      callbackRef.current();
    }, time);
    return () => {
      clearTimeout(id);
    };
  }, [time]);
};

export type TimeoutScheduler = {
  get pending(): boolean;
  cancel(): void;
  schedule(callback: () => void, timeout: number): void;
};

export const useTimeout = (): TimeoutScheduler => {
  const ref = useRef<TimeoutScheduler>(null!);
  if (ref.current == null) {
    ref.current = new (class implements TimeoutScheduler {
      private _id: any = null;

      get pending(): boolean {
        return this._id != null;
      }

      cancel(): void {
        if (this._id != null) {
          clearTimeout(this._id);
          this._id = null;
        }
      }

      schedule(callback: () => void, timeout: number): void {
        if (this._id != null) {
          clearTimeout(this._id);
        }
        this._id = setTimeout(() => {
          this._id = null;
          callback();
        }, timeout);
      }
    })();
  }
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current.cancel();
    };
  }, []);
  return ref.current;
};
