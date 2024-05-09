import { type RefObject, useEffect, useState } from "react";
import { getElementSize } from "../utils/geometry.ts";
import { type Size } from "../utils/size.ts";

export type ElementResizeCallback = (entry: ResizeObserverEntry) => void;

const observed = new WeakMap<Element, ElementResizeCallback>();

let resizeObserver: ResizeObserver | null = null;

const getResizeObserver = (): ResizeObserver => {
  if (resizeObserver == null) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const callback = observed.get(entry.target);
        if (callback != null) {
          callback(entry);
        }
      }
    });
  }
  return resizeObserver;
};

export const onElementResize = (
  element: Element,
  callback: ElementResizeCallback,
): (() => void) => {
  const resizeObserver = getResizeObserver();
  observed.set(element, callback);
  resizeObserver.observe(element);
  return () => {
    observed.delete(element);
    resizeObserver.unobserve(element);
  };
};

export const useElementSize = (ref: RefObject<Element | null>): Size | null => {
  const [size, setSize] = useState<Size | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (element == null) {
      return;
    }
    return onElementResize(element, () => {
      const newSize = getElementSize(element);
      if (size == null || !size.eq(newSize)) {
        setSize(newSize);
      }
    });
  }, [ref, size]);
  return size;
};
