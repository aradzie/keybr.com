export type Task = {
  cancel(): void;
  readonly fired: boolean;
  readonly cancelled: boolean;
};

class TaskWrapper {
  cancelled: boolean = false;
  fired: boolean = false;

  constructor(readonly callback: () => void) {}

  cancel(): void {
    this.cancelled = true;
  }

  fire(): void {
    if (this.cancelled) {
      return;
    }
    this.fired = true;
    this.callback();
  }
}

export class Tasks {
  readonly #tasks = new Set<TaskWrapper>();

  delayed(timeout: number, callback: () => void): Task {
    const task = new TaskWrapper(callback);

    this.#tasks.add(task);

    const execute = () => {
      this.#tasks.delete(task);
      task.fire();
    };

    const id = setTimeout(execute, timeout);

    const cancel = () => {
      this.#tasks.delete(task);
      task.cancel();
      clearTimeout(id);
    };

    return {
      cancel,
      get fired(): boolean {
        return task.fired;
      },
      get cancelled(): boolean {
        return task.cancelled;
      },
    };
  }

  repeated(timeout: number, callback: () => void): Task {
    const task = new TaskWrapper(callback);

    this.#tasks.add(task);

    const execute = () => {
      task.fire();
    };

    const id = setInterval(execute, timeout);

    const cancel = () => {
      this.#tasks.delete(task);
      task.cancel();
      clearInterval(id);
    };

    return {
      cancel,
      get fired(): boolean {
        return task.fired;
      },
      get cancelled(): boolean {
        return task.cancelled;
      },
    };
  }

  cancelAll(): void {
    for (const task of this.#tasks) {
      task.cancel();
    }
    this.#tasks.clear();
  }
}
