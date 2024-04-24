import { clsx } from "clsx";
import { type ReactNode } from "react";
import { styleSizeFill } from "../../styles/size.ts";
import { getFieldClassNames } from "./classNames.ts";
import * as styles from "./FieldList.module.less";
import { type FieldListProps, type FieldProps } from "./FieldList.types.ts";

export function FieldList(props: FieldListProps): ReactNode {
  const { as: Component = "div", className, id, title, children } = props;
  return (
    <Component
      id={id} //
      className={clsx(styles.fieldList, className)}
      title={title}
    >
      {children}
    </Component>
  );
}

export function Field(props: FieldProps): ReactNode {
  const { as: Component = "span", className, id, title, children } = props;
  return (
    <Component
      id={id} //
      className={clsx(styles.field, getFieldClassNames(props), className)}
      title={title}
    >
      {children}
    </Component>
  );
}

Field.Filler = function Filler(): ReactNode {
  return <span className={styleSizeFill} />;
};
