import { useEffect, useLayoutEffect, useRef } from "react";

export const useTimeout = (callback: () => void, time: number): void => {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    const id = setTimeout(() => {
      callbackRef.current();
    }, time);
    return () => {
      clearTimeout(id);
    };
  }, [time]);
};
