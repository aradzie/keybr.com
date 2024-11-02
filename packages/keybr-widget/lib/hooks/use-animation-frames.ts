import { useEffect, useRef } from "react";
import { AnimationFrames } from "../utils/index.ts";

export const useAnimationFrames = () => {
  const ref = useRef<AnimationFrames>(null!);
  if (ref.current == null) {
    ref.current = new AnimationFrames();
  }
  useEffect(() => {
    return () => {
      ref.current.cancel();
    };
  }, []);
  return ref.current;
};
