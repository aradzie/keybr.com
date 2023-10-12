import {
  styleSizeFill,
  styleSizeFillAlt,
  styleSizeFit,
} from "../../styles/size.ts";
import * as fieldStyles from "./FieldList.module.less";
import {
  type FieldGrow,
  type FieldProps,
  type FieldSize,
} from "./FieldList.types.ts";

const fieldSizeMapping: { readonly [key in FieldSize]: string } = {
  fit: styleSizeFit,
  fill: styleSizeFill,
  fillAlt: styleSizeFillAlt,
};
const fieldGrowMapping: { readonly [key in FieldGrow]: string } = {
  1: fieldStyles.flexGrow1,
  2: fieldStyles.flexGrow2,
  3: fieldStyles.flexGrow3,
  4: fieldStyles.flexGrow4,
  5: fieldStyles.flexGrow5,
};

export function getFieldClassNames({ size, grow }: FieldProps): string[] {
  const classNames: string[] = [];
  if (size != null) {
    classNames.push(fieldSizeMapping[size]);
  }
  if (grow != null) {
    classNames.push(fieldGrowMapping[grow]);
  }
  return classNames;
}
