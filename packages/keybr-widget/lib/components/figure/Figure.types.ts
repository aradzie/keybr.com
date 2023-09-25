import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { type ClassName } from "../types.ts";

export type FigureProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
  readonly caption?: ReactNode;
  readonly description?: ReactNode;
  readonly legend?: ReactNode;
};

export type FigureCaptionProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
};

export type FigureDescriptionProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
};

export type FigureLegendProps = {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly children?: ReactNode;
};
