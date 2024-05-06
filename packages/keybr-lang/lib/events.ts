export type EventType = string | symbol;

export type EventHandler<T = unknown> = (event: T) => void;

export class EventEmitter<Events extends Record<EventType, unknown> = any> {
  readonly #handlers = new Map<EventType, Set<EventHandler<any>>>();

  on<Key extends EventType>(type: Key, handler: EventHandler<Events[Key]>) {
    let handlers = this.#handlers.get(type);
    if (handlers == null) {
      this.#handlers.set(type, (handlers = new Set()));
    }
    handlers.add(handler);
    return this;
  }

  off<Key extends EventType>(type: Key, handler?: EventHandler<Events[Key]>) {
    if (handler != null) {
      let handlers = this.#handlers.get(type);
      if (handlers != null) {
        handlers.delete(handler);
      }
    } else {
      this.#handlers.delete(type);
    }
    return this;
  }

  emit<Key extends EventType>(type: Key, event: Events[Key]) {
    const handlers = this.#handlers.get(type);
    if (handlers != null) {
      for (const handler of handlers) {
        handler(event);
      }
    }
    return this;
  }
}
