import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Figure.module.less";
import {
  type FigureCaptionProps,
  type FigureDescriptionProps,
  type FigureLegendProps,
  type FigureProps,
} from "./Figure.types.ts";

export function Figure(props: FigureProps): ReactNode {
  const {
    as: Component = "figure",
    id,
    title,
    className,
    children,
    caption,
    description,
    legend,
  } = props;
  return (
    <Component
      id={id} //
      className={clsx(styles.root, className)}
      title={title}
    >
      {caption && <Figure.Caption>{caption}</Figure.Caption>}
      {description && <Figure.Description>{description}</Figure.Description>}
      {children}
      {legend && <Figure.Legend>{legend}</Figure.Legend>}
    </Component>
  );
}

function FigureCaption(props: FigureCaptionProps): ReactNode {
  const {
    as: Component = "figcaption",
    id,
    title,
    className,
    children,
  } = props;
  return (
    <Component
      id={id} //
      className={clsx(styles.caption, className)}
      title={title}
    >
      {children}
    </Component>
  );
}

function FigureDescription(props: FigureDescriptionProps): ReactNode {
  const { as: Component = "p", id, title, className, children } = props;
  return (
    <Component
      id={id} //
      className={clsx(styles.description, className)}
      title={title}
    >
      {children}
    </Component>
  );
}

function FigureLegend(props: FigureLegendProps): ReactNode {
  const { as: Component = "p", id, title, className, children } = props;
  return (
    <Component
      id={id} //
      className={clsx(styles.legend, className)}
      title={title}
    >
      {children}
    </Component>
  );
}

Figure.Caption = FigureCaption;
Figure.Description = FigureDescription;
Figure.Legend = FigureLegend;
