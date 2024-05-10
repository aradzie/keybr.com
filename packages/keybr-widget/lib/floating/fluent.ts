import {
  getBoundingBox,
  getScreenSize,
  type Rect,
  type Size,
} from "../utils/index.ts";
import {
  alignToAnchor as alignToAnchor0,
  centerToScreen as centerToScreen0,
} from "./align.ts";
import { placeElement } from "./place.ts";
import { resizeElement } from "./resize.ts";
import {
  type AlignOptions,
  type FloatingHeight,
  type FloatingWidth,
} from "./types.ts";

export const place = (popup: HTMLElement, arrow: HTMLElement | null = null) => {
  let options = {} as Partial<AlignOptions>;

  const withOptions = (newOptions: Partial<AlignOptions>) => {
    options = { ...options, ...newOptions };
    return {
      withOptions,
      resize,
      centerToScreen,
      alignToAnchor,
    };
  };

  const resize = (
    anchorSize: Size,
    width: FloatingWidth | null,
    height: FloatingHeight | null,
  ) => {
    resizeElement(popup, anchorSize, width, height);
    return {
      centerToScreen,
      alignToAnchor,
    };
  };

  const centerToScreen = (screenSize: Size = getScreenSize()) => {
    const popupBox = getBoundingBox(popup, "absolute");
    const popupPlace = centerToScreen0(popupBox, screenSize);
    placeElement(popup, popupPlace);
  };

  const alignToAnchor = (
    anchorBox: Rect,
    screenSize: Size = getScreenSize(),
  ) => {
    const popupBox = getBoundingBox(popup, "absolute");
    const [popupPlace, arrowPlace] = alignToAnchor0(
      popupBox,
      anchorBox,
      screenSize,
      options,
    );
    placeElement(popup, popupPlace);
    if (arrow != null) {
      placeElement(arrow, arrowPlace);
    }
  };

  return {
    withOptions,
    resize,
    centerToScreen,
    alignToAnchor,
  };
};
