import { type ClassName } from "../types.ts";

export type ProgressBarProps = {
  readonly className?: ClassName;
  readonly total: number;
  readonly current: number;
};
