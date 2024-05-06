import { catchError } from "@keybr/debug";
import { type Result } from "@keybr/result";
import { useEffect, useState } from "react";
import { type ResultStorage } from "./types.ts";

export type LoaderState =
  | {
      readonly type: "loading";
      readonly total: number;
      readonly current: number;
    }
  | {
      readonly type: "ready";
      readonly results: readonly Result[];
    };

export function useLoader(storage: ResultStorage): LoaderState {
  const [state, setState] = useState<LoaderState>({
    type: "loading",
    total: 0,
    current: 0,
  });

  useEffect(() => {
    let didCancel = false;

    const load = async () => {
      const results = await storage.load((total, current) => {
        if (!didCancel) {
          setState({ type: "loading", total, current });
        }
      });
      if (!didCancel) {
        setState({ type: "ready", results });
      }
    };

    load().catch(catchError);

    return () => {
      didCancel = true;
    };
  }, [storage]);

  return state;
}
