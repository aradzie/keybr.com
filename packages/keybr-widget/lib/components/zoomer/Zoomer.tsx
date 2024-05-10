import { mdiCursorMove } from "@mdi/js";
import { clsx } from "clsx";
import {
  cloneElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDocumentEvent, useWindowEvent } from "../../hooks/index.ts";
import { getBoundingBox, getScreenSize, Rect } from "../../utils/index.ts";
import { Icon } from "../icon/index.ts";
import * as styles from "./Zoomer.module.less";

const globalMoving = { current: null as HTMLElement | null };

const screenMargin = 30;

export type ZoomableProps = {
  readonly moving?: boolean;
};

export function Zoomer({
  children,
}: {
  readonly children: ReactElement<ZoomableProps>;
}): ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [moving, setMoving] = useState(false);
  const [{ x, y }, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const root = rootRef.current;
    if (root != null) {
      // A non-passive event handler that actually can prevent default.
      // https://github.com/facebook/react/issues/14856
      const handler = (ev: WheelEvent) => {
        setZoom(zoom - Math.sign(ev.deltaY) * 0.05);
        setHover(true);
        ev.preventDefault();
      };
      root.addEventListener("wheel", handler);
      return () => {
        root.removeEventListener("wheel", handler);
      };
    }
    return;
  }, [zoom]);
  useDocumentEvent("mousedown", (ev) => {
    const root = rootRef.current;
    if (root != null && !moving && contains(root, ev.target)) {
      setMoving(true);
      globalMoving.current = rootRef.current;
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
      setPosition(place(root).move(x, y, ev.movementX, ev.movementY));
      ev.preventDefault();
    }
  });
  useWindowEvent("resize", () => {
    const root = rootRef.current;
    if (root != null) {
      const [newZoom, newPosition] = place(root).fitToScreen(zoom, x, y);
      setZoom(newZoom);
      setPosition(newPosition);
    }
  });
  useEffect(() => {
    const root = rootRef.current;
    if (root != null) {
      const [newZoom, newPosition] = place(root).fitToScreen(zoom, x, y);
      setZoom(newZoom);
      setPosition(newPosition);
    }
  }, [zoom, x, y]);
  useEffect(() => {
    if (hover && !moving) {
      const timeout = setTimeout(() => {
        setHover(false);
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
    return;
  }, [hover, moving]);
  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, (hover || moving) && styles.hover)}
      style={{
        position: "relative",
        insetInlineStart: x,
        insetBlockStart: y,
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
          setPosition({ x: 0, y: 0 });
          setZoom(1);
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

function place(root: HTMLElement) {
  const rootBox = getBoundingBox(root, "fixed");
  const screenSize = getScreenSize();
  const screenBox = new Rect(
    screenMargin,
    screenMargin,
    screenSize.width - screenMargin * 2,
    screenSize.height - screenMargin * 2,
  );
  const areaBox = new Rect(
    screenBox.x,
    screenBox.y,
    screenBox.width - rootBox.width,
    screenBox.height - rootBox.height,
  );

  const move = (x: number, y: number, dx: number, dy: number) => {
    if (
      (dx < 0 && rootBox.left + dx >= areaBox.left) ||
      (dx > 0 && rootBox.left + dx <= areaBox.right)
    ) {
      x += dx;
    }
    if (
      (dy < 0 && rootBox.top + dy >= areaBox.top) ||
      (dy > 0 && rootBox.top + dy <= areaBox.bottom)
    ) {
      y += dy;
    }
    return { x, y };
  };

  const fitToScreen = (zoom: number, x: number, y: number) => {
    if (
      zoom > 1 &&
      (rootBox.width > screenBox.width || rootBox.height > screenBox.height)
    ) {
      zoom = Math.min(
        (screenBox.width / rootBox.width) * zoom,
        (screenBox.height / rootBox.height) * zoom,
      );
      return [zoom, { x: Math.floor(x), y: Math.floor(y) }] as const;
    }
    if (x !== 0) {
      if (rootBox.left < areaBox.left) {
        x += areaBox.left - rootBox.left;
      } else if (rootBox.left > areaBox.right) {
        x -= rootBox.left - areaBox.right;
      }
    }
    if (y !== 0) {
      if (rootBox.top < areaBox.top) {
        y += areaBox.top - rootBox.top;
      } else if (rootBox.top > areaBox.bottom) {
        y -= rootBox.top - areaBox.bottom;
      }
    }
    return [zoom, { x: Math.floor(x), y: Math.floor(y) }] as const;
  };

  return {
    move,
    fitToScreen,
  };
}

function contains(root: Element, target: unknown): boolean {
  return (
    target instanceof Element && (root === target || root.contains(target))
  );
}
