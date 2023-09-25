export function hide(element: HTMLElement): void {
  const { style } = element;
  style.display = "none";
  style.left = "";
  style.top = "";
  style.right = "";
  style.bottom = "";
  style.width = "";
  style.height = "";
}

export function show(
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
  style.display = "";
  style.left = left != null ? `${left}px` : "";
  style.top = top != null ? `${top}px` : "";
  style.right = right != null ? `${right}px` : "";
  style.bottom = bottom != null ? `${bottom}px` : "";
  style.width = width != null ? `${width}px` : "";
  style.height = height != null ? `${height}px` : "";
}
