import { parseColor } from "@keybr/color";
import { type GraphicsStyle } from "@keybr/widget";
import { type ClassValue, clsx } from "clsx";
import { useMemo } from "react";
import { useTheme } from "./context.ts";
import { useDynamicStyles } from "./dynamic-styles-context.tsx";
import { type PropName } from "./theme-props.ts";

export const useComputedStyles = () => {
  const { color, font, hash } = useTheme();
  const { getStyledElement } = useDynamicStyles();
  const element = getStyledElement();
  return useMemo(() => {
    use(color, font, hash);

    const style = getComputedStyle(element);

    const getPropertyValue = (name: PropName): string => {
      return style.getPropertyValue(name);
    };

    const computeStyle = (...className: ClassValue[]): GraphicsStyle => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
      // The returned style is a live CSSStyleDeclaration object, which updates itself automatically
      // when the element's style is changed.
      // The values returned by getComputedStyle are known as resolved values. These are usually the
      // same as the CSS 2.1 computed values, but for some older properties like width, height or
      // padding, they are instead the used values.
      const child = createElement("div", className);
      element.appendChild(child);
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
      } = getComputedStyle(child);
      element.removeChild(child);
      const result: GraphicsStyle = {};
      if (font != null) {
        if (font.length > 0) {
          result.font = font;
        } else {
          // A fix for Firefox in which the font property is an empty string.
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
          const color = parseColor(fill).toRgb();
          if (fillOpacity != null) {
            const value = Number(fillOpacity);
            if (value !== 1) {
              color.alpha = value;
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
          const color = parseColor(stroke).toRgb();
          if (strokeOpacity != null) {
            const value = Number(strokeOpacity);
            if (value !== 1) {
              color.alpha = value;
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

    const computeLineHeight = (...className: ClassValue[]): number => {
      const child = createElement("p", className);
      child.style.lineHeight = "1";
      element.appendChild(child);
      const value = child.clientHeight;
      element.removeChild(child);
      return value;
    };

    return { getPropertyValue, computeStyle, computeLineHeight };
  }, [color, font, hash, element]);
};

function use(...arg: any) {}

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
