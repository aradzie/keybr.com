import { type MouseProps } from "../props.ts";
import { type ClassName } from "../types.ts";

export type IconProps = {
  readonly shape: string;
  readonly className?: ClassName;
  readonly viewBox?: string;
} & MouseProps;
