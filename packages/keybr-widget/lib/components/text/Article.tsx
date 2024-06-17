import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Article.module.less";
import { type ArticleProps } from "./Article.types.ts";

export function Article(props: ArticleProps): ReactNode {
  const { as: Component = "article", id, title, className, children } = props;
  return (
    <Component id={id} className={clsx(styles.root, className)} title={title}>
      {children}
    </Component>
  );
}
