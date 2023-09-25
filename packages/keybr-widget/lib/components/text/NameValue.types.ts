import { type ReactNode } from "react";
import { type ClassName } from "../types.ts";

export type NameValueProps = {
  readonly className?: ClassName;
  readonly title?: string;
  readonly name: ReactNode;
  readonly value: ReactNode;
};

export type NameProps = {
  readonly className?: ClassName;
  readonly title?: string;
  readonly name?: string;
  readonly children?: ReactNode;
};

export type ValueProps = {
  readonly className?: ClassName;
  readonly title?: string;
  readonly value?: any;
  readonly delta?: number;
  readonly children?: ReactNode;
};
