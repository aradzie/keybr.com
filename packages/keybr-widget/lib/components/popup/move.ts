export function move(
  element: HTMLElement,
  {
    left,
    top,
    right,
    bottom,
    width,
    height,
  }: {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
    width?: number;
    height?: number;
  },
): void {
  const { style } = element;
  style.left = left != null ? `${left}px` : "";
  style.top = top != null ? `${top}px` : "";
  style.right = right != null ? `${right}px` : "";
  style.bottom = bottom != null ? `${bottom}px` : "";
  style.width = width != null ? `${width}px` : "";
  style.height = height != null ? `${height}px` : "";
}
