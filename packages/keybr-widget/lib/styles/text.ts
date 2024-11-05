import { type ClassName } from "../components/index.ts";
import * as styles from "./text.module.less";

export const styleTextCenter = styles.textCenter;
export const styleTextStart = styles.textStart;
export const styleTextEnd = styles.textEnd;
export const styleTextNoWrap = styles.textNoWrap;
export const styleTextTruncate = styles.textTruncate;

export type AlignName = "start" | "center" | "end";

export const alignClassName = (value?: AlignName | null): ClassName => {
  switch (value) {
    case "start":
      return styleTextStart;
    case "center":
      return styleTextCenter;
    case "end":
      return styleTextEnd;
  }
  return null;
};
