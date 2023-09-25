import {
  styleSizeFill,
  styleSizeFillAlt,
  styleSizeFit,
} from "../../styles/size.ts";
import * as boxStyles from "./Box.module.less";
import {
  type BoxAlignContent,
  type BoxAlignItems,
  type BoxDirection,
  type BoxJustifyContent,
  type BoxProps,
  type BoxWrap,
} from "./Box.types.ts";
import * as boxItemStyles from "./BoxItem.module.less";
import {
  type BoxItemGrow,
  type BoxItemOrder,
  type BoxItemProps,
  type BoxItemSize,
  type BoxSelfAlign,
} from "./BoxItem.types.ts";

const directionMapping: { readonly [key in BoxDirection]: string } = {
  row: boxStyles.hFlex,
  column: boxStyles.vFlex,
};
const wrapMapping: { readonly [key in BoxWrap]: string } = {
  "wrap": boxStyles.flexWrap,
  "wrap-reverse": boxStyles.flexWrapReverse,
  "nowrap": boxStyles.flexNoWrap,
};
const justifyContentMapping: { readonly [key in BoxJustifyContent]: string } = {
  "start": boxStyles.justifyContentStart,
  "end": boxStyles.justifyContentEnd,
  "center": boxStyles.justifyContentCenter,
  "space-between": boxStyles.justifyContentSpaceBetween,
  "space-around": boxStyles.justifyContentSpaceAround,
};
const alignItemsMapping: { readonly [key in BoxAlignItems]: string } = {
  start: boxStyles.alignItemsStart,
  end: boxStyles.alignItemsEnd,
  center: boxStyles.alignItemsCenter,
  baseline: boxStyles.alignItemsBaseline,
  stretch: boxStyles.alignItemsStretch,
};
const alignContentMapping: { readonly [key in BoxAlignContent]: string } = {
  "start": boxStyles.alignContentStart,
  "end": boxStyles.alignContentEnd,
  "center": boxStyles.alignContentCenter,
  "space-between": boxStyles.alignContentSpaceBetween,
  "space-around": boxStyles.alignContentSpaceAround,
  "stretch": boxStyles.alignContentStretch,
};
const selfAlignMapping: { readonly [key in BoxSelfAlign]: string } = {
  start: boxItemStyles.selfAlignStart,
  end: boxItemStyles.selfAlignEnd,
  center: boxItemStyles.selfAlignCenter,
  baseline: boxItemStyles.selfAlignBaseline,
  stretch: boxItemStyles.selfAlignStretch,
};
const itemSizeMapping: { readonly [key in BoxItemSize]: string } = {
  fit: styleSizeFit,
  fill: styleSizeFill,
  fillAlt: styleSizeFillAlt,
};
const itemGrowMapping: { readonly [key in BoxItemGrow]: string } = {
  1: boxItemStyles.flexGrow1,
  2: boxItemStyles.flexGrow2,
  3: boxItemStyles.flexGrow3,
  4: boxItemStyles.flexGrow4,
  5: boxItemStyles.flexGrow5,
};
const itemOrderMapping: { readonly [key in BoxItemOrder]: string } = {
  first: boxItemStyles.flexOrderFirst,
  last: boxItemStyles.flexOrderLast,
  none: boxItemStyles.flexOrderNone,
};

export function getBoxClassNames({
  direction,
  wrap,
  justifyContent,
  alignItems,
  alignContent,
}: BoxProps): string[] {
  const classNames: string[] = [];
  if (direction != null) {
    classNames.push(directionMapping[direction]);
  }
  if (wrap != null) {
    classNames.push(wrapMapping[wrap]);
  }
  if (justifyContent != null) {
    classNames.push(justifyContentMapping[justifyContent]);
  }
  if (alignItems != null) {
    classNames.push(alignItemsMapping[alignItems]);
  }
  if (alignContent != null) {
    classNames.push(alignContentMapping[alignContent]);
  }
  return classNames;
}

export function getBoxItemClassNames({
  size,
  grow,
  order,
  selfAlign,
}: BoxItemProps): string[] {
  const classNames: string[] = [];
  if (size != null) {
    classNames.push(itemSizeMapping[size]);
  }
  if (grow != null) {
    classNames.push(itemGrowMapping[grow]);
  }
  if (order != null) {
    classNames.push(itemOrderMapping[order]);
  }
  if (selfAlign != null) {
    classNames.push(selfAlignMapping[selfAlign]);
  }
  return classNames;
}
