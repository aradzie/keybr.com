import { type Task } from "@keybr/lang";
import { useRef } from "react";
import { useTasks } from "./use-tasks.ts";

export type TimeoutScheduler = {
  get pending(): boolean;
  cancel(): void;
  schedule(callback: () => void, timeout: number): void;
};

export const useTimeout = () => {
  const tasks = useTasks();
  const ref = useRef<TimeoutScheduler>(null!);
  if (ref.current == null) {
    ref.current = new (class implements TimeoutScheduler {
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
        this.#task = tasks.delayed(timeout, callback);
      }
    })();
  }
  return ref.current;
};
