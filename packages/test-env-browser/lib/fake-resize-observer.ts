export class FakeResizeObserver implements ResizeObserver {
  constructor(readonly callback: ResizeObserverCallback) {}

  disconnect(): void {}

  observe(target: Element, options?: ResizeObserverOptions): void {}

  unobserve(target: Element): void {}
}
