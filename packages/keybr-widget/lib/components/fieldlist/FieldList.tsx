import { type ReactNode } from "react";
import { sizeClassName, styleSizeFill } from "../../styles/size.ts";
import * as styles from "./FieldList.module.less";
import { type FieldListProps, type FieldProps } from "./FieldList.types.ts";

export function FieldList(props: FieldListProps): ReactNode {
  const { as: Component = "div", title, children } = props;
  return (
    <Component className={styles.root} title={title}>
      {children}
    </Component>
  );
}

export function Field(props: FieldProps): ReactNode {
  const { as: Component = "span", size, title, children } = props;
  return (
    <Component className={sizeClassName(size)} title={title}>
      {children}
    </Component>
  );
}

Field.Filler = function Filler(): ReactNode {
  return <span className={styleSizeFill} />;
};
