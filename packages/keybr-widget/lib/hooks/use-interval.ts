import { useEffect, useLayoutEffect, useRef } from "react";

export const useInterval = (callback: () => void, time: number): void => {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    const id = setInterval(() => {
      callbackRef.current();
    }, time);
    return () => {
      clearInterval(id);
    };
  }, [time]);
};
