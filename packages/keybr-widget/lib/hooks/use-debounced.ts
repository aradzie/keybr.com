import { useEffect, useState } from "react";

export const useDebounced = <T>(value: T, time: number = 200): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value);
    }, time);
    return () => {
      clearTimeout(id);
    };
  }, [value, time]);
  return debounced;
};
