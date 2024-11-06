export type Task = {
  cancel(): void;
  readonly fired: boolean;
  readonly cancelled: boolean;
};

export class Tasks {
  readonly #tasks = new Set<Task>();

  get pending(): number {
    return this.#tasks.size;
  }

  delayed(timeout: number, callback: () => void): Task {
    let fired = false;
    let cancelled = false;
    const cancel = () => {
      if (cancelled) {
        return;
      }
      cancelled = true;
      this.#tasks.delete(task);
      clearTimeout(id);
    };

    const task = new (class implements Task {
      cancel() {
        cancel();
      }
      get fired() {
        return fired;
      }
      get cancelled() {
        return cancelled;
      }
    })();

    this.#tasks.add(task);

    const id = setTimeout(() => {
      if (cancelled) {
        return;
      }
      this.#tasks.delete(task);
      fired = true;
      callback();
    }, timeout);

    return task;
  }

  repeated(timeout: number, callback: () => void): Task {
    let fired = false;
    let cancelled = false;
    const cancel = () => {
      if (cancelled) {
        return;
      }
      cancelled = true;
      this.#tasks.delete(task);
      clearInterval(id);
    };

    const task = new (class implements Task {
      cancel() {
        cancel();
      }
      get fired() {
        return fired;
      }
      get cancelled() {
        return cancelled;
      }
    })();

    this.#tasks.add(task);

    const id = setInterval(() => {
      if (cancelled) {
        return;
      }
      fired = true;
      callback();
    }, timeout);

    return task;
  }

  cancelAll() {
    for (const task of this.#tasks) {
      task.cancel();
    }
    return this;
  }
}
