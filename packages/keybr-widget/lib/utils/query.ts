export function querySelector<E extends Element = Element>(
  selector: string,
): E {
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
