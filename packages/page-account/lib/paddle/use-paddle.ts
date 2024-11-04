import { catchError } from "@keybr/debug";
import { type Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { loadPaddle } from "./loader.ts";

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  useEffect(() => {
    let didCancel = false;
    loadPaddle()
      .then((paddle) => {
        if (!didCancel) {
          setPaddle(paddle);
        }
      })
      .catch(catchError);
    return () => {
      didCancel = true;
    };
  }, []);
  return paddle;
}
