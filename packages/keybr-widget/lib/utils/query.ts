export function querySelector<E extends Element = Element>(
  selector: Element | string,
): E {
  if (selector instanceof Element) {
    return selector as E;
  }
  if (typeof selector === "string") {
    const element = document.querySelector<E>(selector);
    if (element == null) {
      throw new Error(
        process.env.NODE_ENV !== "production"
          ? `Element [${selector}] not found`
          : undefined,
      );
    }
    return element;
  }
  throw new TypeError();
}
