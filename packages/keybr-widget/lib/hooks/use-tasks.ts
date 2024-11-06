import { Tasks } from "@keybr/lang";
import { useEffect, useRef } from "react";

export const useTasks = () => {
  const ref = useRef<Tasks>(null!);
  if (ref.current == null) {
    ref.current = new Tasks();
  }
  useEffect(() => {
    return () => {
      ref.current.cancelAll();
    };
  }, []);
  return ref.current;
};
