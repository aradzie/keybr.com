import { type ReactElement, type ReactNode } from "react";
import {
  type AlignOptions,
  type FloatingHeight,
  type FloatingWidth,
} from "../../floating/index.ts";
import { type AnchorProps } from "../types.ts";

export type PopoverProps = {
  readonly anchor: ReactElement<AnchorProps>;
  readonly children: ReactNode;
  readonly height?: FloatingHeight;
  readonly open: boolean;
  readonly width?: FloatingWidth;
} & Partial<AlignOptions>;
