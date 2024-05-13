import { mdiCursorMove } from "@mdi/js";
import { clsx } from "clsx";
import {
  cloneElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDocumentEvent, useWindowEvent } from "../../hooks/index.ts";
import { Icon } from "../icon/index.ts";
import { place } from "./place.ts";
import { useMouseWheel } from "./use-mouse-wheel.ts";
import * as styles from "./Zoomer.module.less";
import { type ZoomablePosition, type ZoomerProps } from "./Zoomer.types.ts";

const globalMoving = { current: null as HTMLElement | null };

const savedPositions = new Map<string, ZoomablePosition>();

export function Zoomer({ children, id = null }: ZoomerProps): ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [moving, setMoving] = useState(false);
  const [{ x, y, zoom }, setPosition] = useState(
    (id && savedPositions.get(id)) || { x: 0, y: 0, zoom: 1 },
  );
  useMouseWheel(rootRef.current, (ev) => {
    setPosition({ x, y, zoom: zoom - Math.sign(ev.deltaY) * 0.05 });
    setHover(true);
    ev.preventDefault();
  });
  useDocumentEvent("mousedown", (ev) => {
    const root = rootRef.current;
    if (root != null && !moving && contains(root, ev.target)) {
      setMoving(true);
      setHover(false);
      globalMoving.current = root;
      ev.preventDefault();
    }
  });
  useDocumentEvent("mouseup", (ev) => {
    const root = rootRef.current;
    if (root != null && moving) {
      setMoving(false);
      setHover(true);
      globalMoving.current = null;
      ev.preventDefault();
    }
  });
  useDocumentEvent("mousemove", (ev) => {
    const root = rootRef.current;
    if (root != null && moving) {
      setPosition({ x: x + ev.movementX, y: y + ev.movementY, zoom });
      ev.preventDefault();
    }
  });
  useWindowEvent("resize", () => {
    const root = rootRef.current;
    if (root != null) {
      setPosition(place(root).fitToScreen({ x, y, zoom }));
    }
  });
  useEffect(() => {
    const root = rootRef.current;
    if (root != null) {
      setPosition(place(root).fitToScreen({ x, y, zoom }));
    }
  }, [x, y, zoom]);
  useEffect(() => {
    if (id) {
      savedPositions.set(id, { x, y, zoom });
    }
  }, [id, x, y, zoom]);
  useEffect(() => {
    if (hover) {
      const timeout = setTimeout(() => {
        setHover(false);
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
    return;
  }, [hover]);
  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, (hover || moving) && styles.hover)}
      style={{
        position: "relative",
        left: x,
        top: y,
        transform: `scale(${zoom})`,
      }}
      onMouseEnter={() => {
        setHover(globalMoving.current == null);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onClick={(ev) => {
        if (ev.altKey) {
          setHover(false);
          setMoving(false);
          setPosition({ x: 0, y: 0, zoom: 1 });
        }
      }}
    >
      {cloneElement(children, { ...children.props, moving })}
      {(hover || moving) && (
        <Icon className={styles.icon} shape={mdiCursorMove} />
      )}
    </div>
  );
}

function contains(root: Element, target: unknown): boolean {
  return (
    target instanceof Element && (root === target || root.contains(target))
  );
}
