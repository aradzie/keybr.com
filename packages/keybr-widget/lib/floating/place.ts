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
  style.inlineSize = width != null ? `${width}px` : "";
  style.blockSize = height != null ? `${height}px` : "";
  style.insetBlockStart = top != null ? `${top}px` : "";
  style.insetBlockEnd = bottom != null ? `${bottom}px` : "";
  style.insetInlineStart = left != null ? `${left}px` : "";
  style.insetInlineEnd = right != null ? `${right}px` : "";
}
