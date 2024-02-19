import { type ClassValue, clsx } from "clsx";
import { Color } from "../../utils/color.ts";
import { type GraphicsStyle } from "./style.ts";

const createElement = (tagName: string, className: ClassValue): HTMLElement => {
  const element = document.createElement(tagName);
  element.textContent = "?";
  element.className = clsx(className);
  element.style.position = "fixed";
  element.style.insetInlineStart = "0px";
  element.style.insetBlockStart = "0px";
  return element;
};

const isPx = (value: string): boolean => {
  return value.endsWith("px");
};

const parsePx = (value: string): number => {
  return Number(value.substring(0, value.length - 2));
};

export const calcStyle = (
  className: ClassValue,
  parentElement: Element = document.body,
): GraphicsStyle => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
  // The returned style is a live CSSStyleDeclaration object, which updates itself automatically
  // when the element's style is changed.
  // The values returned by getComputedStyle are known as resolved values. These are usually the
  // same as the CSS 2.1 computed values, but for some older properties like width, height or
  // padding, they are instead the used values.
  const element = createElement("div", className);
  parentElement.appendChild(element);
  const {
    font,
    fontStyle,
    fontVariant,
    fontWeight,
    fontSize,
    lineHeight,
    fontFamily,
    textAlign,
    verticalAlign,
    color,
    opacity,
    fill,
    fillOpacity,
    fillRule,
    stroke,
    strokeDasharray,
    strokeDashoffset,
    strokeLinecap,
    strokeLinejoin,
    strokeMiterlimit,
    strokeOpacity,
    strokeWidth,
  } = getComputedStyle(element);
  parentElement.removeChild(element);
  const result: GraphicsStyle = {};
  if (font != null) {
    if (font.length > 0) {
      result.font = font;
    } else {
      // fix for Firefox in which the font property is empty string
      result.font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} / ${lineHeight} ${fontFamily}`;
    }
  }
  switch (textAlign) {
    case "left":
      result.textAlign = "left";
      break;
    case "right":
      result.textAlign = "right";
      break;
    case "center":
      result.textAlign = "center";
      break;
    case "start":
      result.textAlign = "start";
      break;
    case "end":
      result.textAlign = "end";
      break;
  }
  switch (verticalAlign) {
    case "top":
      result.textBaseline = "top";
      break;
    case "baseline":
      result.textBaseline = "alphabetic";
      break;
    case "middle":
      result.textBaseline = "middle";
      break;
    case "bottom":
      result.textBaseline = "bottom";
      break;
  }
  if (fill != null && fill !== "none") {
    try {
      const color = Color.parse(fill).toRgb();
      if (fillOpacity != null) {
        const value = Number(fillOpacity);
        if (value !== 1) {
          color.a = value;
        }
      }
      result.fillStyle = color;
    } catch {
      // Ignore.
    }
  }
  switch (fillRule) {
    case "nonzero":
    case "evenodd":
      result.fillRule = fillRule;
      break;
  }
  if (stroke != null && stroke !== "none") {
    try {
      const color = Color.parse(stroke).toRgb();
      if (strokeOpacity != null) {
        const value = Number(strokeOpacity);
        if (value !== 1) {
          color.a = value;
        }
      }
      result.strokeStyle = color;
    } catch {
      // Ignore.
    }
  }
  switch (strokeLinecap) {
    case "butt":
    case "round":
    case "square":
      result.lineCap = strokeLinecap;
      break;
  }
  switch (strokeLinejoin) {
    case "bevel":
    case "round":
    case "miter":
      result.lineJoin = strokeLinejoin;
      break;
  }
  if (strokeWidth != null && isPx(strokeWidth)) {
    result.lineWidth = parsePx(strokeWidth);
  }
  if (strokeMiterlimit != null) {
    result.miterLimit = Number(strokeMiterlimit);
  }
  return result;
};

export const calcLineHeight = (
  className: ClassValue,
  parentElement: Element = document.body,
): number => {
  const element = createElement("p", className);
  element.style.lineHeight = "1";
  parentElement.appendChild(element);
  const value = element.clientHeight;
  parentElement.removeChild(element);
  return value;
};
