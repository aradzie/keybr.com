import { useEffect, useRef } from "react";

export const useInterval0 = (callback: () => void, time: number): void => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    const id = window.setInterval(() => {
      callbackRef.current();
    }, time);
    return () => {
      window.clearInterval(id);
    };
  }, [time]);
};

export type IntervalScheduler = {
  get pending(): boolean;
  cancel(): void;
  schedule(callback: () => void, timeout: number): void;
};

export const useInterval = (): IntervalScheduler => {
  const ref = useRef(
    new (class implements IntervalScheduler {
      private _id: number = 0;

      get pending(): boolean {
        return this._id > 0;
      }

      cancel(): void {
        if (this._id > 0) {
          window.clearInterval(this._id);
          this._id = 0;
        }
      }

      schedule(callback: () => void, timeout: number): void {
        if (this._id > 0) {
          window.clearInterval(this._id);
        }
        this._id = window.setInterval(() => {
          callback();
        }, timeout);
      }
    })(),
  );
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current.cancel();
    };
  }, []);
  return ref.current;
};
