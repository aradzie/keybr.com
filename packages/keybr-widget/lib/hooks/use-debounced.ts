import { Tasks } from "@keybr/lang";
import { useEffect, useState } from "react";

export const useDebounced = <T>(value: T, time: number = 200): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const tasks = new Tasks();
    tasks.delayed(time, () => {
      setDebounced(value);
    });
    return () => {
      tasks.cancelAll();
    };
  }, [value, time]);
  return debounced;
};
