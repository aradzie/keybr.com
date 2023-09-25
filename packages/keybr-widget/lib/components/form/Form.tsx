import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Form.module.less";
import {
  type FieldSetProps,
  type FormProps,
  type LegendProps,
} from "./Form.types.ts";

export function Form(props: FormProps): ReactNode {
  const { className, id, title, children } = props;
  return (
    <form
      id={id} //
      className={clsx(styles.form, className)}
      title={title}
    >
      {children}
    </form>
  );
}

export function FieldSet(props: FieldSetProps): ReactNode {
  const { className, id, disabled, legend, title, children } = props;
  return (
    <fieldset
      id={id} //
      className={clsx(styles.fieldSet, className)}
      disabled={disabled}
      title={title}
    >
      {legend && <Legend>{legend}</Legend>}
      {children}
    </fieldset>
  );
}

export function Legend(props: LegendProps): ReactNode {
  const { className, id, children, title } = props;
  return (
    <legend
      id={id} //
      className={clsx(styles.legend, className)}
      title={title}
    >
      {children}
    </legend>
  );
}
