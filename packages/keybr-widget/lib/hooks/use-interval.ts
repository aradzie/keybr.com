import { type Task } from "@keybr/lang";
import { useRef } from "react";
import { useTasks } from "./use-tasks.ts";

export type IntervalScheduler = {
  get pending(): boolean;
  cancel(): void;
  schedule(callback: () => void, timeout: number): void;
};

export const useInterval = () => {
  const tasks = useTasks();
  const ref = useRef<IntervalScheduler>(null!);
  if (ref.current == null) {
    ref.current = new (class implements IntervalScheduler {
      #task: Task | null = null;

      get pending() {
        return this.#task != null;
      }

      cancel() {
        if (this.#task != null) {
          this.#task.cancel();
          this.#task = null;
        }
      }

      schedule(callback: () => void, timeout: number) {
        this.cancel();
        this.#task = tasks.repeated(timeout, callback);
      }
    })();
  }
  return ref.current;
};
