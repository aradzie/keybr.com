export type Place = {
  readonly left?: number;
  readonly top?: number;
  readonly right?: number;
  readonly bottom?: number;
  readonly width?: number;
  readonly height?: number;
};

export function placeElement(
  element: HTMLElement,
  { left, top, right, bottom, width, height }: Place,
): void {
  const { style } = element;
  style.width = width != null ? `${width}px` : "";
  style.height = height != null ? `${height}px` : "";
  style.left = left != null ? `${left}px` : "";
  style.right = right != null ? `${right}px` : "";
  style.top = top != null ? `${top}px` : "";
  style.bottom = bottom != null ? `${bottom}px` : "";
}
