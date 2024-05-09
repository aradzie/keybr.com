import { type ClassName, type MouseProps } from "../types.ts";

export type IconProps = {
  readonly shape: string;
  readonly className?: ClassName;
  readonly viewBox?: string;
} & MouseProps;
